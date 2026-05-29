import Link from "next/link";

export function SetupBanner() {
  return (
    <div className="border-b border-amber-800/50 bg-amber-950/40 px-4 py-3 text-center text-sm text-amber-100">
      Supabase not configured. Copy{" "}
      <code className="rounded bg-stone-900 px-1.5 py-0.5">.env.local.example</code> to{" "}
      <code className="rounded bg-stone-900 px-1.5 py-0.5">.env.local</code>, run the migration
      in{" "}
      <Link href="https://supabase.com" className="underline hover:text-accent-light">
        Supabase
      </Link>
      , then <code className="rounded bg-stone-900 px-1.5 py-0.5">npm run seed</code>.
    </div>
  );
}
