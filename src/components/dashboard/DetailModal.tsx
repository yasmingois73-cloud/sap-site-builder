import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgressBar } from "./ProgressBar";
import { Gauge } from "./Gauge";
import { Logo } from "./Logo";
import { nf, type Painel } from "@/lib/dashboard-data";

export function DetailModal({
  painel,
  dataHora,
  open,
  onOpenChange,
}: {
  painel: Painel;
  dataHora: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string>("todas");
  // Adicione esta linha para controlar a nova janela:
  const [graficoLeiturista, setGraficoLeiturista] = useState<Painel["leituristas"][number] | null>(
    null,
  );

  type SortKey = "nome" | "total" | "emAberto" | "concluidas" | "registrados";
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" } | null>(
    null,
  );

  const handleSort = (key: SortKey) => {
    // Para números, o padrão é decrescente (maior pro menor). Se clicar de novo, inverte.
    let direction: "asc" | "desc" = "desc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const leituristas = useMemo(() => {
    // 1. Aplica o filtro de texto da busca
    const dadosFiltrados = painel.leituristas.filter((l) =>
      l.nome.toLowerCase().includes(busca.toLowerCase()),
    );

    // 2. Aplica a ordenação se alguma coluna foi clicada
    if (sortConfig !== null) {
      dadosFiltrados.sort((a, b) => {
        const valorA = a[sortConfig.key];
        const valorB = b[sortConfig.key];

        if (valorA < valorB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valorA > valorB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return dadosFiltrados;
  }, [painel.leituristas, busca, sortConfig]);

  type SortKeyAdm = "nome" | "totalLeituras" | "emAberto" | "concluidas" | "registrados";
  const [sortConfigAdm, setSortConfigAdm] = useState<{
    key: SortKeyAdm;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSortAdm = (key: SortKeyAdm) => {
    let direction: "asc" | "desc" = "desc";
    if (sortConfigAdm && sortConfigAdm.key === key && sortConfigAdm.direction === "desc") {
      direction = "asc";
    }
    setSortConfigAdm({ key, direction });
  };

  const sortedAdms = useMemo(() => {
    // Faz uma cópia da lista original para não alterar o estado global
    const dados = [...painel.adms];

    if (sortConfigAdm !== null) {
      dados.sort((a, b) => {
        const valorA = a[sortConfigAdm.key];
        const valorB = b[sortConfigAdm.key];

        if (valorA < valorB) return sortConfigAdm.direction === "asc" ? -1 : 1;
        if (valorA > valorB) return sortConfigAdm.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return dados;
  }, [painel.adms, sortConfigAdm]);

  const [hora, dia] = dataHora.split(" ").reverse();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="card-gradient max-w-[1500px] gap-0 overflow-hidden rounded-3xl p-0">
          <DialogHeader className="red-gradient flex-row items-center gap-4 px-6 py-4">
            <Logo className="hidden h-11 w-11 shrink-0 sm:block" />
            <DialogTitle className="text-xl font-semibold text-primary-foreground">
              {painel.titulo}{" "}
              <span className="ml-2 text-sm font-medium opacity-90">
                {hora}-{dia} | {painel.lote}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid max-h-[78vh] gap-8 overflow-y-auto p-6 lg:grid-cols-3">
            {/* Coluna 1: leituristas */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="w-[190px]">
                    <SelectValue placeholder="Selecione a Cat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as categorias</SelectItem>
                    <SelectItem value="residencial">Residencial</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Pesquisar Leiturista..."
                  className="w-[240px]"
                />
              </div>

              <div className="max-h-[430px] overflow-auto space-y-4 pr-2">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-brand-navy text-primary-foreground select-none">
                    <tr className="text-left text-[11px] tracking-wide uppercase">
                      <th
                        className="px-3 py-3 font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSort("nome")}
                      >
                        Nome Leiturista{" "}
                        <span className="ml-1 opacity-50">
                          {sortConfig?.key === "nome"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </th>

                      <th
                        className="px-2 py-3 text-right font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSort("total")}
                      >
                        Total Leit.{" "}
                        <span className="ml-1 opacity-50">
                          {sortConfig?.key === "total"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </th>

                      <th
                        className="px-2 py-3 text-right font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSort("emAberto")}
                      >
                        Em Aberto{" "}
                        <span className="ml-1 opacity-50">
                          {sortConfig?.key === "emAberto"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </th>

                      <th
                        className="px-2 py-3 text-right font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSort("concluidas")}
                      >
                        Conc.{" "}
                        <span className="ml-1 opacity-50">
                          {sortConfig?.key === "concluidas"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </th>

                      <th
                        className="px-2 py-3 text-right font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSort("registrados")}
                      >
                        Registrados{" "}
                        <span className="ml-1 opacity-50">
                          {sortConfig?.key === "registrados"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leituristas.map((l) => (
                      <tr
                        key={l.nome}
                        onClick={() => setGraficoLeiturista(l)}
                        className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/30 transition-colors"
                        title="Clique para ver o gráfico"
                      >
                        <td className="px-3 py-2 whitespace-nowrap">{l.nome}</td>
                        <td className="px-2 py-2 text-right">{nf.format(l.total)}</td>
                        <td className="px-2 py-2 text-right text-brand-red">
                          {nf.format(l.emAberto)}
                        </td>
                        <td className="px-2 py-2 text-right text-brand-green">
                          {nf.format(l.concluidas)}
                        </td>
                        <td className="px-2 py-2 text-right text-bar-mid">
                          {nf.format(l.registrados)}
                        </td>
                      </tr>
                    ))}
                    {leituristas.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                          Nenhum leiturista encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Coluna 2: municípios */}
            <div className="space-y-6">
              {painel.municipios.map((m) => (
                <div key={m.nome} className="text-center">
                  <p className="text-lg font-semibold tracking-tight">{m.nome}</p>
                  <div className="mt-1 flex justify-center gap-8 text-xs text-muted-foreground">
                    <span>Total Leituras</span>
                    <span>Concluídas</span>
                    <span>Em Aberto</span>
                  </div>
                  <div className="flex justify-center gap-10 text-sm font-medium">
                    <span>{nf.format(m.totalLeituras)}</span>
                    <span>{nf.format(m.concluidas)}</span>
                    <span>{nf.format(m.emAberto)}</span>
                  </div>
                  <ProgressBar percentual={m.percentual} className="mt-2" />
                </div>
              ))}
            </div>

            {/* Coluna 3: totais + ADM */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center gap-8 text-lg font-bold">
                  <span>Total Leituras</span>
                  <span className="text-brand-green">Concluídas</span>
                  <span className="text-brand-red">Em Aberto</span>
                </div>
                <div className="flex justify-center gap-12 text-base font-medium">
                  <span>{nf.format(painel.totalLeituras)}</span>
                  <span className="text-brand-green">{nf.format(painel.concluidas)}</span>
                  <span className="text-brand-red">{nf.format(painel.emAberto)}</span>
                </div>
                <div className="mt-3 flex justify-center">
                  <Gauge percentual={painel.percentual} />
                </div>
              </div>

              <div className="max-h-[360px] overflow-auto rounded-md border border-border">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-brand-navy text-primary-foreground select-none">
                    <tr className="text-left text-[11px] tracking-wide uppercase">
                      <th
                        className="px-3 py-3 font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSortAdm("nome")}
                      >
                        Nome ADM{" "}
                        <span className="ml-1 opacity-50">
                          {sortConfigAdm?.key === "nome"
                            ? sortConfigAdm.direction === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </th>

                      <th
                        className="px-2 py-3 text-right font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSortAdm("totalLeituras")}
                      >
                        Total Leituras{" "}
                        <span className="ml-1 opacity-50">
                          {sortConfigAdm?.key === "totalLeituras"
                            ? sortConfigAdm.direction === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </th>

                      <th
                        className="px-2 py-3 text-right font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSortAdm("emAberto")}
                      >
                        Em Aberto{" "}
                        <span className="ml-1 opacity-50">
                          {sortConfigAdm?.key === "emAberto"
                            ? sortConfigAdm.direction === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </th>

                      <th
                        className="px-2 py-3 text-right font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSortAdm("concluidas")}
                      >
                        Concluídas{" "}
                        <span className="ml-1 opacity-50">
                          {sortConfigAdm?.key === "concluidas"
                            ? sortConfigAdm.direction === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </th>

                      <th
                        className="px-2 py-3 text-right font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSortAdm("registrados")}
                      >
                        Registrados{" "}
                        <span className="ml-1 opacity-50">
                          {sortConfigAdm?.key === "registrados"
                            ? sortConfigAdm.direction === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAdms.map((a) => (
                      <tr key={a.nome} className="border-b border-border last:border-0">
                        <td className="px-3 py-2 whitespace-nowrap">
                          {a.nome}{" "}
                          <span className="font-semibold text-brand-red">{a.percentual}%</span>
                        </td>
                        <td className="px-2 py-2 text-right">{nf.format(a.totalLeituras)}</td>
                        <td className="px-2 py-2 text-right text-brand-red">
                          {nf.format(a.emAberto)}
                        </td>
                        <td className="px-2 py-2 text-right text-brand-green">
                          {nf.format(a.concluidas)}
                        </td>
                        <td className="px-2 py-2 text-right text-bar-mid">
                          {nf.format(a.registrados)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* === NOVA JANELA (MODAL DO GRÁFICO) === */}
      {graficoLeiturista && (
        <Dialog
          open={!!graficoLeiturista}
          onOpenChange={(aberto) => !aberto && setGraficoLeiturista(null)}
        >
          <DialogContent className="max-w-md bg-card p-6 rounded-2xl border border-border shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold text-primary-foreground mb-4">
                {graficoLeiturista.nome}
              </DialogTitle>
            </DialogHeader>

            {/* Aumentei a altura para h-56 para dar espaço aos números fixos */}
            <div className="flex h-56 items-end justify-around gap-4 text-xs font-semibold">
              {/* Coluna 1: Total */}
              <div className="flex h-full w-full flex-col items-center justify-end">
                {/* Números permanentemente visíveis */}
                <span className="mb-2 text-primary-foreground">
                  {nf.format(graficoLeiturista.total)}
                </span>
                <div
                  className="w-full rounded-t-md bg-blue-500 transition-all duration-700"
                  style={{
                    height: `${(graficoLeiturista.total / Math.max(graficoLeiturista.total, graficoLeiturista.emAberto, graficoLeiturista.concluidas, graficoLeiturista.registrados || 1)) * 100}%`,
                  }}
                ></div>
                <span className="mt-3 text-muted-foreground uppercase tracking-wider">Total</span>
              </div>

              {/* Coluna 2: Em Aberto */}
              <div className="flex h-full w-full flex-col items-center justify-end">
                <span className="mb-2 text-brand-red">{nf.format(graficoLeiturista.emAberto)}</span>
                <div
                  className="w-full rounded-t-md bg-brand-red transition-all duration-700"
                  style={{
                    height: `${(graficoLeiturista.emAberto / Math.max(graficoLeiturista.total, graficoLeiturista.emAberto, graficoLeiturista.concluidas, graficoLeiturista.registrados || 1)) * 100}%`,
                  }}
                ></div>
                <span className="mt-3 text-muted-foreground uppercase tracking-wider">Aberto</span>
              </div>

              {/* Coluna 3: Concluídas */}
              <div className="flex h-full w-full flex-col items-center justify-end">
                <span className="mb-2 text-brand-green">
                  {nf.format(graficoLeiturista.concluidas)}
                </span>
                <div
                  className="w-full rounded-t-md bg-brand-green transition-all duration-700"
                  style={{
                    height: `${(graficoLeiturista.concluidas / Math.max(graficoLeiturista.total, graficoLeiturista.emAberto, graficoLeiturista.concluidas, graficoLeiturista.registrados || 1)) * 100}%`,
                  }}
                ></div>
                <span className="mt-3 text-muted-foreground uppercase tracking-wider">Concl.</span>
              </div>

              {/* Coluna 4: Registrados */}
              <div className="flex h-full w-full flex-col items-center justify-end">
                <span className="mb-2 text-bar-mid">
                  {nf.format(graficoLeiturista.registrados)}
                </span>
                <div
                  className="w-full rounded-t-md bg-bar-mid transition-all duration-700"
                  style={{
                    height: `${(graficoLeiturista.registrados / Math.max(graficoLeiturista.total, graficoLeiturista.emAberto, graficoLeiturista.concluidas, graficoLeiturista.registrados || 1)) * 100}%`,
                  }}
                ></div>
                <span className="mt-3 text-muted-foreground uppercase tracking-wider">Reg.</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* ======================================= */}
    </>
  );
}
