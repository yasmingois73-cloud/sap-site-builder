import { nf } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export interface CatData {
  cat: string;
  supervisor: string;
  total_leituras: number;
  feito: number;
  falta: number;
  defeituoso: number;
  percentual_concluido: number;
}

export interface SummaryCardData {
  titulo: string;
  percentual_concluido: number;
  total_leituras: number;
  feito: number;
  falta: number;
  defeituoso: number;
  cats: CatData[];
}

export interface CodificacaoData {
  codigos: number;
  efetividade: number;
}

export function SummaryCard({
  painel,
  codificacao,
  efetividade,
  lote,
  onOpen,
  onOpenCodificacao,
}: {
  painel: SummaryCardData;
  codificacao?: CodificacaoData;
  efetividade:CodificacaoData;
  lote?: string | null;
  onOpen: () => void;
  onOpenCodificacao: () => void;
}) {
  const cats = painel?.cats ?? [];

  const getBarColor = (percentual: number, titulo: string) => {
    if (titulo === "Repescagem") {
      return percentual >= 100
        ? "bg-brand-green"
        : "bg-[#E58A00]";
    }

    if (percentual <= 50) {
      return "bg-brand-red";
    }

    if (percentual <= 95) {
      return "bg-[#E58A00]";
    }

    return "bg-brand-green";
  };

  return (
    <section className="card-gradient panel-shadow relative overflow-hidden rounded-3xl border border-border p-6 backdrop-blur">

      <span className="red-gradient absolute inset-x-0 top-0 h-1" />

      {/* CABEÇALHO */}
      <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-sky uppercase">
          Lote: {lote ?? "Sem dados"}
        </p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          {painel.titulo}
        </h2>
      </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-[#53BDEB]">
            {painel.percentual_concluido}%
          </p>

          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
            concluído
          </p>
        </div>
      </div>

      {/* EM ABERTO */}
      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/30 px-4 py-3">
        <div>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
            Em aberto
          </p>

          <p className="text-xl font-bold text-foreground">
            {nf.format(painel.falta)}
          </p>
        </div>

        <Button
          onClick={onOpen}
          variant="ghost"
          className="rounded-full border-0 bg-transparent p-0 text-foreground shadow-none hover:bg-transparent hover:text-foreground"
        >
          Ver detalhes
          <ArrowUpRight />
        </Button>
      </div>

      {/* CODIFICAÇÃO */}
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-border/70 bg-background/30 px-4 py-3">
        <div>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
            Codificação - Efetividade
          </p>

          <p className="text-xl font-bold text-foreground">
          {nf.format(codificacao?.codigos ?? 0)} -{" "}
          {nf.format(codificacao?.efetividade ?? 0)}%
        </p>
        </div>

        <Button
          onClick={onOpenCodificacao}
          variant="ghost"
          className="rounded-full border-0 bg-transparent p-0 text-foreground shadow-none hover:bg-transparent hover:text-foreground"
        >
          Ver detalhes
          <ArrowUpRight />
        </Button>
      </div>

      {/* CATS */}
      <div className="mt-6">
        <div className="space-y-5">
          {[...cats]
            .sort((a, b) => b.falta - a.falta)
            .map((cat) => (
            <div key={`${cat.cat}-${cat.supervisor}`}>

              {/* CAT + SUPERVISOR */}
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {cat.cat} - {cat.supervisor}
              </p>

              {/* BARRA + EM ABERTO */}
              <div className="mt-2 flex items-center gap-3">

                {/* BARRA */}
                <div className="relative h-7 flex-1 overflow-hidden rounded-full bg-muted/50">

                  {/* PROGRESSO */}
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all ${getBarColor(
                      cat.percentual_concluido,
                      painel.titulo
                    )}`}
                    style={{
                      width: `${Math.min(
                        Math.max(cat.percentual_concluido, 0),
                        100
                      )}%`,
                    }}
                  />

                  {/* PERCENTUAL */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground">
                      {cat.percentual_concluido}%
                    </span>
                  </div>
                </div>

                {/* EM ABERTO */}
                <span className="w-20 text-right text-sm font-semibold text-foreground">
                  {nf.format(cat.falta)}
                </span>

              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}