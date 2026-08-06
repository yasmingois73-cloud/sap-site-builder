import { barTone } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const toneClass = {
  low: "bg-bar-low",
  mid: "bg-bar-mid",
  done: "bg-bar-done",
} as const;

export function ProgressBar({
  percentual,
  variant = "pill",
  className,
}: {
  percentual: number;
  variant?: "pill" | "inline";
  className?: string;
}) {
  const tone = barTone(percentual);
  const width = Math.max(Math.min(percentual, 100), variant === "pill" ? 9 : 0);

  return (
    <div
      className={cn("relative h-6 w-full overflow-hidden rounded-full bg-bar-track", className)}
      role="progressbar"
      aria-valuenow={percentual}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "flex h-full items-center justify-center rounded-full transition-[width] duration-700",
          toneClass[tone],
        )}
        style={{ width: `${width}%` }}
      >
        <span className="px-2 text-[11px] font-semibold whitespace-nowrap text-on-bar">
          {percentual}%
        </span>
      </div>
    </div>
  );
}
