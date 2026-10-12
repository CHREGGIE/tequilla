import { AgaveMark } from "@/components/brand/icons";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <AgaveMark className="h-[1.15em] w-[1.15em] text-agave-700" />
      <span className="font-display font-semibold lowercase tracking-tight text-espresso">
        tequillist
      </span>
    </span>
  );
}
