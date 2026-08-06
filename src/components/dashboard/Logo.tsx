export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-start gap-0.5 leading-none">
        <span className="font-sans text-5xl font-bold text-brand-red italic">e</span>
        <span className="mt-1 text-2xl font-bold text-brand-blue">+</span>
      </div>
      <p className="text-lg font-semibold tracking-tight text-brand-blue">Ceneged</p>
      <p className="text-[10px] tracking-[0.18em] text-brand-red uppercase">energia positiva</p>
    </div>
  );
}
