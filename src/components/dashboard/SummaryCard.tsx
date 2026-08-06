import { barTone, nf, type Painel } from "@/lib/dashboard-data";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export function SummaryCard({ painel, onOpen }: { painel: Painel; onOpen: () => void }) {
  return (
    <section className="card-gradient panel-shadow relative overflow-hidden rounded-3xl border border-border p-6 backdrop-blur">
      <span className="red-gradient absolute inset-x-0 top-0 h-1" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-sky uppercase">
            {painel.lote}
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {painel.titulo}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-brand-red">{painel.percentual}%</p>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">concluído</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/30 px-4 py-3">
        <div>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
            Total em aberto
          </p>
          <p className="text-xl font-bold text-brand-red">{nf.format(painel.totalEmAberto)}</p>
        </div>
        <Button onClick={onOpen} className="rounded-full">
          Ver detalhes <ArrowUpRight />
        </Button>
      </div>

      <ul className="mt-5 space-y-4">
        {painel.municipios.map((m) => (
          <li key={m.nome}>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {m.nome}
            </p>
            <div className="mt-1.5 flex items-center gap-3">
              <ProgressBar percentual={m.percentual} className="flex-1" />
              <span
                className={
                  barTone(m.percentual) === "done"
                    ? "w-16 text-right text-sm font-semibold text-brand-green"
                    : "w-16 text-right text-sm font-semibold text-brand-red"
                }
              >
                {nf.format(m.emAberto)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
