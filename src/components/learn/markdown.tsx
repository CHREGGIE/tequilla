import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";

// Raw HTML stays disabled (react-markdown's default), so content needs no sanitizing.
const components: Components = {
  h2: ({ children }) => <h2 className="mt-10 mb-3 text-2xl">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-8 mb-2 text-xl">{children}</h3>,
  p: ({ children }) => <p className="my-4 leading-relaxed text-foreground/90">{children}</p>,
  ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-5 marker:text-oak-400">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal space-y-3 pl-5 marker:text-oak-400">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-relaxed text-foreground/90">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  a: ({ href = "", children }) => {
    const className = "text-accent underline decoration-copper-300 underline-offset-2 hover:decoration-accent";
    return href.startsWith("/") ? (
      <Link href={href} className={className}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  },
};

export function Markdown({ children }: { children: string }) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
}
