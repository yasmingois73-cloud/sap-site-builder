import logo from "@/assets/ceneged-logo.png";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Ceneged — energia positiva"
      className={cn("h-16 w-16 rounded-xl object-cover glow-shadow", className)}
      loading="lazy"
    />
  );
}