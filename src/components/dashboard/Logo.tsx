import logo from "@/assets/ceneged-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="Ceneged — energia positiva"
      className={cn("h-16 w-16 rounded-xl object-cover glow-shadow", className)}
      loading="lazy"
    />
  );
}
