import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
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

function Index() {
  const [tipo, setTipo] = useState<string>("");
  const [importacao, setImportacao] = useState<string>(dataHoraPadrao);
  const [aberto, setAberto] = useState<"evolucao" | "repescagem" | null>(null);

  return (
    <main className="page-gradient min-h-screen px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Acompanhamento Diário Leitura
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Bem vindo(a) ao Acompanhamento Diário de Evolução da leitura e Respescagem.
            </p>
          </div>
          <Logo className="shrink-0" />
        </header>

        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-[190px] bg-card">
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
            <Button variant="secondary" className="bg-brand-green text-primary-foreground hover:bg-brand-green/90">
              <Plus /> Importar
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Select value={importacao} onValueChange={setImportacao}>
              <SelectTrigger className="w-[350px] bg-card">
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
            <Button className="ring-2 ring-primary/40 ring-offset-2">Buscar</Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <SummaryCard painel={evolucao} onOpen={() => setAberto("evolucao")} />
          <SummaryCard painel={repescagem} onOpen={() => setAberto("repescagem")} />
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
