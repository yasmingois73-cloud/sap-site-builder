import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/dashboard/Logo";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { DetailModal } from "@/components/dashboard/DetailModal";
import {
  dataHora as dataHoraPadrao,
  evolucao,
  importacoes,
  nf,
  repescagem,
  tiposPlanilha,
} from "@/lib/dashboard-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acompanhamento Diário Leitura | Ceneged" },
      {
        name: "description",
        content:
          "Painel de acompanhamento diário da evolução de leitura e repescagem, com indicadores por município, leiturista e ADM.",
      },
      { property: "og:title", content: "Acompanhamento Diário Leitura | Ceneged" },
      {
        property: "og:description",
        content: "Evolução da leitura e repescagem em tempo real, com dados importados do SAP.",
      },
    ],
  }),
  component: Index,
});

const kpis = [
  { label: "Total de leituras", valor: evolucao.totalLeituras + repescagem.totalLeituras },
  { label: "Concluídas", valor: evolucao.concluidas + repescagem.concluidas, tone: "green" },
  { label: "Em aberto", valor: evolucao.emAberto + repescagem.emAberto, tone: "red" },
] as const;

function Index() {
  const [tipo, setTipo] = useState<string>("");
  const [importacao, setImportacao] = useState<string>(dataHoraPadrao);
  const [aberto, setAberto] = useState<"evolucao" | "repescagem" | null>(null);

  return (
    <main className="page-gradient min-h-screen">
      <div className="grid-lines">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-14">
          <header className="card-gradient panel-shadow flex flex-wrap items-center gap-5 rounded-3xl border border-border p-5 lg:p-7">
            <Logo />
            <div className="min-w-[220px] flex-1">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-sky uppercase">
                Ceneged · energia positiva
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight lg:text-4xl">
                Acompanhamento Diário Leitura
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Evolução da leitura e repescagem — dados importados do SAP.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/30 px-4 py-3 text-right">
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                Última importação
              </p>
              <p className="text-sm font-semibold">{importacao}</p>
            </div>
          </header>

          <section className="mt-5 grid gap-4 sm:grid-cols-3">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="card-gradient rounded-2xl border border-border px-5 py-4"
              >
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  {k.label}
                </p>
                <p
                  className={
                    "tone" in k && k.tone === "red"
                      ? "text-2xl font-bold text-brand-red"
                      : "tone" in k && k.tone === "green"
                        ? "text-2xl font-bold text-brand-green"
                        : "text-2xl font-bold text-foreground"
                  }
                >
                  {nf.format(k.valor)}
                </p>
              </div>
            ))}
          </section>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-background/25 p-4">
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-[190px] bg-card/70">
                <SelectValue placeholder="Tipo de planilha" />
              </SelectTrigger>
              <SelectContent>
                {tiposPlanilha.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={importacao} onValueChange={setImportacao}>
              <SelectTrigger className="w-[240px] bg-card/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {importacoes.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="rounded-full">
              <Search /> Buscar
            </Button>
            <Button
              variant="secondary"
              className="rounded-full border border-brand-green/40 bg-brand-green/15 text-brand-green hover:bg-brand-green/25"
            >
              <Plus /> Importar
            </Button>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <SummaryCard painel={evolucao} onOpen={() => setAberto("evolucao")} />
            <SummaryCard painel={repescagem} onOpen={() => setAberto("repescagem")} />
          </div>
        </div>
      </div>

      <DetailModal
        painel={evolucao}
        dataHora={importacao}
        open={aberto === "evolucao"}
        onOpenChange={(v) => setAberto(v ? "evolucao" : null)}
      />
      <DetailModal
        painel={repescagem}
        dataHora={importacao}
        open={aberto === "repescagem"}
        onOpenChange={(v) => setAberto(v ? "repescagem" : null)}
      />
    </main>
  );
}
