import { useState, useRef, type ChangeEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
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
  evolucao as evolucaoPadrao,
  importacoes,
  nf,
  repescagem as repescagemPadrao,
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
  const [evolucao, setEvolucao] = useState(evolucaoPadrao);
  const [repescagem, setRepescagem] = useState(repescagemPadrao);

  const [opcoesData, setOpcoesData] = useState<string[]>(importacoes);

  const [dataModalAberto, setDataModalAberto] = useState(false);
  const [dataTemp, setDataTemp] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const datasDisponiveis = opcoesData.filter((d) => d !== "Todas as datas");

  const kpis = [
    { label: "Total de leituras", valor: evolucao.totalLeituras + repescagem.totalLeituras },
    { label: "Concluídas", valor: evolucao.concluidas + repescagem.concluidas, tone: "green" },
    { label: "Em aberto", valor: evolucao.emAberto + repescagem.emAberto, tone: "red" },
  ] as const;

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const getDatePart = (value: string) => {
    return value.split(" ")[0]?.split("T")[0] ?? "";
  };

  const dateToISO = (value: string) => {
    if (!value || value === "Todas as datas") return "";

    const base = getDatePart(value);

    if (/^\d{4}-\d{2}-\d{2}$/.test(base)) {
      return base;
    }

    const partes = base.split("/");
    if (partes.length !== 3) return "";

    const [dia, mes, ano] = partes;
    if (!dia || !mes || !ano) return "";

    return `${ano}-${mes}-${dia}`;
  };

  const dateToBR = (value: string) => {
    if (!value) return "";

    const base = getDatePart(value);

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(base)) {
      return base;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(base)) {
      const [ano, mes, dia] = base.split("-");
      if (!ano || !mes || !dia) return value;
      return `${dia}/${mes}/${ano}`;
    }

    return value;
  };

  const getTodayISO = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  const abrirSelecionadorData = () => {
    setDataTemp(dateToISO(importacao));
    setDataModalAberto(true);
  };

  const confirmarData = () => {
    if (!dataTemp) return;

    setImportacao(dateToBR(dataTemp));
    setDataModalAberto(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const buffer = loadEvent.target?.result as ArrayBuffer;
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames?.[0];

      if (!sheetName || !workbook.Sheets[sheetName]) {
        toast.error("Não foi possível localizar uma aba válida na planilha.");
        return;
      }

      const ws = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<Record<string, string | undefined>>(ws, {
        raw: false,
      });

      const errosCount = data.length;

      if (errosCount === 0) {
        toast.info("A planilha está vazia.");
        return;
      }

      const nomeEvolucao =
        tiposPlanilha.find((t) => t.toLowerCase().includes("evolu")) ?? tiposPlanilha[0] ?? "";
      setTipo(nomeEvolucao);

      const datasUnicas = Array.from(
        new Set(
          data
            .map((row) => row["Data"])
            .filter(Boolean)
            .map(String),
        ),
      );

      if (datasUnicas.length > 0) {
        setOpcoesData((prev) => Array.from(new Set(["Todas as datas", ...datasUnicas, ...prev])));
        setImportacao("Todas as datas");
      }

      setEvolucao((prev) => {
        const novosLeituristas = [...prev.leituristas];
        const novosAdms = [...prev.adms];

        data.forEach((row) => {
          const nomeLeiturista = row["Leiturista"];
          const nomeAdm = row["Supervisor"];

          if (nomeLeiturista) {
            const index = novosLeituristas.findIndex((l) => l.nome === nomeLeiturista);
            if (index >= 0) {
              const leiturista = novosLeituristas[index];
              if (leiturista) {
                novosLeituristas[index] = {
                  ...leiturista,
                  emAberto: leiturista.emAberto + 1,
                  total: leiturista.total + 1,
                };
              }
            } else {
              novosLeituristas.push({
                nome: nomeLeiturista,
                total: 1,
                emAberto: 1,
                concluidas: 0,
                registrados: 0,
              });
            }
          }

          if (nomeAdm) {
            const index = novosAdms.findIndex((a) => a.nome === nomeAdm);
            if (index >= 0) {
              const adm = novosAdms[index];
              if (adm) {
                const novoTotal = adm.totalLeituras + 1;
                novosAdms[index] = {
                  ...adm,
                  emAberto: adm.emAberto + 1,
                  totalLeituras: novoTotal,
                  percentual: parseFloat(((adm.concluidas / novoTotal) * 100).toFixed(2)),
                };
              }
            } else {
              novosAdms.push({
                nome: nomeAdm,
                totalLeituras: 1,
                emAberto: 1,
                concluidas: 0,
                registrados: 0,
                percentual: 0,
              });
            }
          }
        });

        const novoTotalLeituras = prev.totalLeituras + errosCount;
        const novoEmAberto = prev.emAberto + errosCount;
        const novoPercentual = parseFloat(((prev.concluidas / novoTotalLeituras) * 100).toFixed(2));

        return {
          ...prev,
          totalLeituras: novoTotalLeituras,
          emAberto: novoEmAberto,
          totalEmAberto: prev.totalEmAberto ? prev.totalEmAberto + errosCount : novoEmAberto,
          percentual: novoPercentual,
          leituristas: novosLeituristas,
          adms: novosAdms,
        };
      });

      toast.success(`Arquivo importado! Foram localizadas leituras de: ${datasUnicas.join(", ")}`);
    };

    reader.onerror = () => {
      toast.error("Não foi possível ler a planilha selecionada.");
    };

    reader.readAsArrayBuffer(file);
  };

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

            <Button
              type="button"
              variant="secondary"
              className="rounded-full"
              onClick={abrirSelecionadorData}
            >
              Selecionar data
            </Button>

            <Button className="rounded-full">
              <Search /> Buscar
            </Button>
            <Button
              variant="secondary"
              className="rounded-full border border-brand-green/40 bg-brand-green/15 text-brand-green hover:bg-brand-green/25"
              onClick={handleImport}
            >
              <Plus /> Importar
            </Button>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {dataModalAberto && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-xl">
                <h2 className="text-lg font-semibold">Selecionar data</h2>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border/70 p-3 text-center">
                    <p className="text-xs uppercase opacity-60">Dia</p>
                    <p className="text-2xl font-bold">{dataTemp ? dataTemp.slice(8, 10) : "--"}</p>
                  </div>

                  <div className="rounded-xl border border-border/70 p-3 text-center">
                    <p className="text-xs uppercase opacity-60">Mês</p>
                    <p className="text-2xl font-bold">{dataTemp ? dataTemp.slice(5, 7) : "--"}</p>
                  </div>

                  <div className="rounded-xl border border-border/70 p-3 text-center">
                    <p className="text-xs uppercase opacity-60">Ano</p>
                    <p className="text-2xl font-bold">{dataTemp ? dataTemp.slice(0, 4) : "--"}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-border/70 bg-card/70 px-3 py-2">
                  <input
                    type="date"
                    value={dataTemp}
                    onChange={(e) => setDataTemp(e.currentTarget.value)}
                    className="w-full bg-transparent text-sm text-foreground outline-none dark:[color-scheme:dark]"
                  />

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase opacity-60">
                      Datas disponíveis na tabela importada
                    </p>

                    <div className="max-h-40 overflow-auto rounded-xl border border-border/70 bg-card/40 p-2">
                      <div className="grid grid-cols-2 gap-2">
                        {datasDisponiveis.map((data) => {
                          const iso = dateToISO(data);
                          const selecionada = dataTemp === iso;

                          return (
                            <button
                              key={data}
                              type="button"
                              onClick={() => setDataTemp(iso)}
                              className={
                                selecionada
                                  ? "rounded-lg border border-brand-green bg-brand-green/10 px-3 py-2 text-left text-sm font-semibold"
                                  : "rounded-lg border border-border/70 bg-background/40 px-3 py-2 text-left text-sm hover:bg-background/70"
                              }
                            >
                              {dateToBR(data)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setDataTemp(getTodayISO())}
                  >
                    Hoje
                  </Button>

                  <Button type="button" variant="outline" onClick={() => setDataModalAberto(false)}>
                    Cancelar
                  </Button>

                  <Button
                    type="button"
                    onClick={confirmarData}
                    disabled={!dataTemp}
                    className="ml-auto"
                  >
                    OK
                  </Button>
                </div>
              </div>
            </div>
          )}

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
