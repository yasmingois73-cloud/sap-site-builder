import { barTone, nf, type Painel } from "@/lib/dashboard-data";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/button";

export function SummaryCard({ painel, onOpen }: { painel: Painel; onOpen: () => void }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 panel-shadow">
      <h2 className="text-xl font-semibold text-brand-blue">{painel.titulo}</h2>

      <Button className="mt-4" onClick={onOpen}>
        Ver detalhes
      </Button>

      <p className="mt-5 text-lg font-medium text-foreground">
        Total em aberto:{" "}
        <span className="font-semibold text-brand-red">{nf.format(painel.totalEmAberto)}</span>
      </p>

      <ul className="mt-5 space-y-4">
        {painel.municipios.map((m) => (
          <li key={m.nome}>
            <p className="text-sm font-semibold tracking-tight text-foreground">{m.nome}</p>
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
