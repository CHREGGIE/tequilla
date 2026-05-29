import * as cheerio from "cheerio";

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; TequillaBot/1.0; +https://tequilla-ten.vercel.app)",
  Accept: "text/html,application/xhtml+xml,image/*",
};

const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);
const BLOCKED_HOST_PREFIXES = ["127.", "10.", "192.168.", "169.254."];
const SKIP_URL_PATTERN = /(?:icon|logo|avatar|sprite|placeholder|pixel|tracking|badge|favicon|spinner)/i;

export interface ImageCandidate {
  url: string;
  label: string;
}

export function assertPublicHttpUrl(raw: string, label = "URL"): URL {
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    throw new Error(`Invalid ${label}`);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`${label} must use http or https`);
  }

  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(hostname)) {
    throw new Error(`${label} is not allowed`);
  }
  if (BLOCKED_HOST_PREFIXES.some((prefix) => hostname.startsWith(prefix))) {
    throw new Error(`${label} is not allowed`);
  }

  const private172 = hostname.match(/^172\.(\d+)\./);
  if (private172) {
    const octet = Number(private172[1]);
    if (octet >= 16 && octet <= 31) {
      throw new Error(`${label} is not allowed`);
    }
  }

  return parsed;
}

function resolveUrl(base: URL, value: string | undefined): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (trimmed.startsWith("data:")) return null;
  try {
    return new URL(trimmed, base).href;
  } catch {
    return null;
  }
}

function pickSrcsetUrl(base: URL, srcset: string | undefined): string | null {
  if (!srcset?.trim()) return null;

  const entries = srcset
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [url, descriptor] = part.split(/\s+/);
      const widthMatch = descriptor?.endsWith("w") ? Number.parseInt(descriptor, 10) : 0;
      return { url, width: Number.isFinite(widthMatch) ? widthMatch : 0 };
    })
    .filter((entry) => entry.url);

  if (!entries.length) return null;

  entries.sort((a, b) => b.width - a.width);
  return resolveUrl(base, entries[0]?.url);
}

function shouldSkipImageUrl(url: string): boolean {
  if (!url || url.startsWith("data:")) return true;
  if (/\.svg(?:\?|$)/i.test(url)) return true;
  return SKIP_URL_PATTERN.test(url);
}

function addCandidate(
  seen: Set<string>,
  results: ImageCandidate[],
  url: string | null,
  label: string,
) {
  if (!url || shouldSkipImageUrl(url) || seen.has(url)) return;
  seen.add(url);
  results.push({ url, label });
}

export function extractImageCandidates(html: string, pageUrl: URL): ImageCandidate[] {
  const $ = cheerio.load(html);
  const seen = new Set<string>();
  const results: ImageCandidate[] = [];

  addCandidate(
    seen,
    results,
    resolveUrl(pageUrl, $('meta[property="og:image"]').attr("content")),
    "Open Graph",
  );
  addCandidate(
    seen,
    results,
    resolveUrl(pageUrl, $('meta[name="twitter:image"]').attr("content")),
    "Twitter card",
  );
  addCandidate(
    seen,
    results,
    resolveUrl(pageUrl, $('link[rel="image_src"]').attr("href")),
    "Page image",
  );

  $("img").each((_, element) => {
    const el = $(element);
    const alt = el.attr("alt")?.trim();
    const label = alt ? `Image: ${alt.slice(0, 40)}` : "Page image";
    const candidates = [
      el.attr("src"),
      el.attr("data-src"),
      el.attr("data-lazy-src"),
      el.attr("data-original"),
    ];

    for (const value of candidates) {
      addCandidate(seen, results, resolveUrl(pageUrl, value), label);
    }

    addCandidate(seen, results, pickSrcsetUrl(pageUrl, el.attr("srcset")), label);
    addCandidate(seen, results, pickSrcsetUrl(pageUrl, el.attr("data-srcset")), label);
  });

  return results.slice(0, 24);
}

export async function fetchPageHtml(pageUrl: URL): Promise<string> {
  const response = await fetch(pageUrl.href, {
    headers: FETCH_HEADERS,
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Could not fetch page (${response.status})`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
    throw new Error("URL does not appear to be an HTML page");
  }

  return response.text();
}

export async function fetchImageCandidatesFromPage(rawUrl: string): Promise<ImageCandidate[]> {
  const pageUrl = assertPublicHttpUrl(rawUrl, "Page URL");
  const html = await fetchPageHtml(pageUrl);
  const candidates = extractImageCandidates(html, pageUrl);

  if (!candidates.length) {
    throw new Error("No suitable images found on that page");
  }

  return candidates;
}

export async function downloadImage(rawUrl: string): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  const imageUrl = assertPublicHttpUrl(rawUrl, "Image URL");
  const response = await fetch(imageUrl.href, {
    headers: FETCH_HEADERS,
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`Could not download image (${response.status})`);
  }

  const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
  if (!contentType.startsWith("image/")) {
    throw new Error("URL did not return an image");
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength === 0) {
    throw new Error("Downloaded image is empty");
  }
  if (buffer.byteLength > 5 * 1024 * 1024) {
    throw new Error("Image exceeds 5 MB limit");
  }

  const ext = extensionForContentType(contentType, imageUrl.pathname);
  return { buffer, contentType, ext };
}

function extensionForContentType(contentType: string, pathname: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  if (map[contentType]) return map[contentType];

  const fromPath = pathname.split(".").pop()?.toLowerCase();
  if (fromPath && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromPath)) {
    return fromPath === "jpeg" ? "jpg" : fromPath;
  }

  return "jpg";
}
