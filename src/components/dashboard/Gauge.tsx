import { barTone } from "@/lib/dashboard-data";

const toneVar = {
  low: "var(--bar-low)",
  mid: "var(--bar-mid)",
  done: "var(--bar-done)",
} as const;

export function Gauge({ percentual }: { percentual: number }) {
  const tone = barTone(percentual);
  const radius = 62;
  const circumference = Math.PI * radius;
  const filled = (Math.min(percentual, 100) / 100) * circumference;

  return (
    <div className="relative w-[160px]">
      <svg viewBox="0 0 160 90" className="w-full">
        <path
          d="M 18 82 A 62 62 0 0 1 142 82"
          fill="none"
          stroke="var(--bar-track)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 18 82 A 62 62 0 0 1 142 82"
          fill="none"
          stroke={toneVar[tone]}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
      </svg>
      <span className="absolute inset-x-0 bottom-1 text-center text-lg font-bold text-foreground">
        {percentual}%
      </span>
    </div>
  );
}
