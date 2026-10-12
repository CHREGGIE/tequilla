import Link from "next/link";

export function SetupBanner() {
  return (
    <div className="border-b border-copper-300 bg-accent-soft px-4 py-3 text-center text-sm text-oak-700">
      Supabase not configured. Copy{" "}
      <code className="rounded bg-cream-100 px-1.5 py-0.5">.env.local.example</code> to{" "}
      <code className="rounded bg-cream-100 px-1.5 py-0.5">.env.local</code>, run the migration
      in{" "}
      <Link href="https://supabase.com" className="underline hover:text-accent">
        Supabase
      </Link>
      , then <code className="rounded bg-cream-100 px-1.5 py-0.5">npm run seed</code>.
    </div>
  );
}
