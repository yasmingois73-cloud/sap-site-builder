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
import { nf } from "@/lib/dashboard-data";
import type { OperacaoDiariaCat, OperacaoDiariaLeiturista, OperacaoDiariaResponsavel  } from "@/api/operacao-diaria";


interface DetailPainel {
  titulo: string;
  percentual_concluido: number;
  total_leituras: number;
  feito: number;
  falta: number;
  defeituoso: number;
}


export function DetailModal({
  painel,
  cats,
  lote,
  leituristas,
  responsaveis,
  dataHora,
  open,
  onOpenChange,
}: {
  painel: DetailPainel;
  cats: OperacaoDiariaCat[];
  lote?: string;
  leituristas: OperacaoDiariaLeiturista[];
  responsaveis: OperacaoDiariaResponsavel[];
  dataHora: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
})  {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string>("todas");

  const [ordenacao, setOrdenacao] = useState<{
  coluna: "leiturista" | "total_leituras" | "falta" | "feito" | "defeituoso";
  direcao: "asc" | "desc";
}>({
  coluna: "falta",
  direcao: "desc",
});

 
  const [hora, dia] = dataHora.split(" ").reverse();
  
  const leituristasFiltrados = useMemo(
  () =>
    leituristas.filter((l) =>
      l.leiturista.toLowerCase().includes(busca.toLowerCase())
    ),
  [leituristas, busca],
);

const leituristasOrdenados = useMemo(() => {
  return [...leituristasFiltrados].sort((a, b) => {
    const { coluna, direcao } = ordenacao;

    let comparacao = 0;

    if (coluna === "leiturista") {
      comparacao = a.leiturista.localeCompare(
        b.leiturista,
        "pt-BR",
        { sensitivity: "base" }
      );
    } else {
      comparacao = a[coluna] - b[coluna];
    }

    return direcao === "asc" ? comparacao : -comparacao;
  });
}, [leituristasFiltrados, ordenacao]);

const getPercentualColor = (percentual: number) => {
  if (percentual <= 50) {
    return "text-brand-red";
  }

  if (percentual <= 95) {
    return "text-[#E58A00]";
  }

  return "text-brand-green";
};

const ordenarPor = (
  coluna:
    | "leiturista"
    | "total_leituras"
    | "falta"
    | "feito"
    | "defeituoso"
) => {
  setOrdenacao((atual) => {
    if (atual.coluna === coluna) {
      return {
        coluna,
        direcao: atual.direcao === "desc" ? "asc" : "desc",
      };
    }

    return {
      coluna,
      direcao: "desc",
    };
  });
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="card-gradient max-w-[1570px] gap-0 overflow-hidden rounded-3xl p-0">

    <DialogHeader className="red-gradient flex-row items-center gap-4 px-6 py-0">
      <Logo className="hidden h-11 w-11 shrink-0 sm:block" />

      <DialogTitle className="text-xl font-semibold text-primary-foreground">
        {painel.titulo}{" "}

        <span className="ml-2 text-sm font-medium opacity-90">
          {hora}-{dia} | Lote: {lote ?? "Sem dados"}
        </span>
      </DialogTitle>
    </DialogHeader>


    {/* CONTAINER DAS COLUNAS */}
    <div className="grid max-h-[78vh] gap-8 overflow-y-auto p-6 lg:grid-cols-3">


      {/* COLUNA 1: LEITURISTAS */}
      <div className="space-y-3">

       
        {/* Pesquisa */}
        <div className="flex flex-wrap gap-3">
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar Leiturista..."
            className="w-[240px]"
          />
        </div>


        {/* Tabela */}
        <div className="max-h-[600px] overflow-auto rounded-md border border-border">
          <table className="w-full border-collapse text-sm">

            
                      <thead className="sticky top-0 bg-brand-navy text-primary-foreground">
                        <tr className="text-left text-[11px] tracking-wide uppercase">

                          <th
                            className="cursor-pointer px-3 py-3 font-semibold hover:bg-white/10"
                            onClick={() => ordenarPor("leiturista")}
                          >
                            <div className="flex items-center gap-1">
                              Nome Leiturista

                              {ordenacao.coluna === "leiturista" && (
                                <span>
                                  {ordenacao.direcao === "desc" ? "↓" : "↑"}
                                </span>
                              )}
                            </div>
                          </th>

                          <th
                            className="cursor-pointer px-2 py-3 text-right font-semibold hover:bg-white/10"
                            onClick={() => ordenarPor("total_leituras")}
                          >
                            <div className="flex items-center justify-end gap-1">
                              Total

                              {ordenacao.coluna === "total_leituras" && (
                                <span>
                                  {ordenacao.direcao === "desc" ? "↓" : "↑"}
                                </span>
                              )}
                            </div>
                          </th>

                          <th
                            className="cursor-pointer px-2 py-3 text-right font-semibold hover:bg-white/10"
                            onClick={() => ordenarPor("falta")}
                          >
                            <div className="flex items-center justify-end gap-1">
                              Em Aberto

                              {ordenacao.coluna === "falta" && (
                                <span>
                                  {ordenacao.direcao === "desc" ? "↓" : "↑"}
                                </span>
                              )}
                            </div>
                          </th>

                          <th
                            className="cursor-pointer px-2 py-3 text-right font-semibold hover:bg-white/10"
                            onClick={() => ordenarPor("feito")}
                          >
                            <div className="flex items-center justify-end gap-1">
                              Concluídas

                              {ordenacao.coluna === "feito" && (
                                <span>
                                  {ordenacao.direcao === "desc" ? "↓" : "↑"}
                                </span>
                              )}
                            </div>
                          </th>

                          <th
                            className="cursor-pointer px-2 py-3 text-right font-semibold hover:bg-white/10"
                            onClick={() => ordenarPor("defeituoso")}
                          >
                            <div className="flex items-center justify-end gap-1">
                              Defeito

                              {ordenacao.coluna === "defeituoso" && (
                                <span>
                                  {ordenacao.direcao === "desc" ? "↓" : "↑"}
                                </span>
                              )}
                            </div>
                          </th>

                        </tr>
                      </thead>


            <tbody>

              {leituristasOrdenados.map((l) => (
                <tr
                  key={l.leiturista}
                  className="border-b border-border last:border-0"
                >

                  <td className="px-3 py-2 whitespace-nowrap">
                    {l.leiturista}
                  </td>

                  <td className="px-2 py-2 text-right">
                    {nf.format(l.total_leituras)}
                  </td>

                  <td className="px-2 py-2 text-right text-brand-red">
                    {nf.format(l.falta)}
                  </td>

                  <td className="px-2 py-2 text-right text-brand-green">
                    {nf.format(l.feito)}
                  </td>

                  <td className="px-2 py-2 text-right">
                    {nf.format(l.defeituoso)}
                  </td>

                </tr>
              ))}


              {leituristasOrdenados.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-muted-foreground"
                  >
                    Nenhum leiturista encontrado.
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>

      </div>


      {/* COLUNA 2: CATS */}
      <div className="space-y-5">

        


        {cats.map((cat) => (
          <div
            key={`${cat.cat}-${cat.supervisor}`}
            className="rounded-2xl border border-border/70 bg-background/30 p-4"
          >

            {/* CAT + SUPERVISOR */}
            <div className="flex items-center justify-between gap-3">

              <div>
                <p className="text-sm font-bold">
                  {cat.cat}
                </p>

                <p className="text-xs text-muted-foreground">
                  {cat.supervisor}
                </p>
              </div>

              <span className="text-lg font-bold">
                {cat.percentual_concluido}%
              </span>

            </div>


            {/* INDICADORES */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">

              <div>
                <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                  Total
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {nf.format(cat.total_leituras)}
                </p>
              </div>


              <div>
                <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                  Concluídas
                </p>

                <p className="mt-1 text-sm font-semibold text-brand-green">
                  {nf.format(cat.feito)}
                </p>
              </div>


              <div>
                <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                  Em aberto
                </p>

                <p className="mt-1 text-sm font-semibold text-brand-red">
                  {nf.format(cat.falta)}
                </p>
              </div>

            </div>


            {/* BARRA */}
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted/50">

              <div
                className="h-full rounded-full bg-brand-green transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(cat.percentual_concluido, 0),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>
        ))}

      </div>

      {/* Coluna 3: Responsáveis */}
<div className="space-y-6">

  {/* Totais gerais */}
  <div className="text-center">
    <div className="flex justify-center gap-8 text-lg font-bold">
      <span>Total Leituras</span>
      <span className="text-brand-green">Concluídas</span>
      <span className="text-brand-red">Em Aberto</span>
    </div>

    <div className="flex justify-center gap-12 text-base font-medium">
      <span>{nf.format(painel.total_leituras)}</span>

      <span className="text-brand-green">
        {nf.format(painel.feito)}
      </span>

      <span className="text-brand-red">
        {nf.format(painel.falta)}
      </span>
    </div>

    <div className="mt-3 flex justify-center">
      <Gauge percentual={painel.percentual_concluido} />
    </div>
  </div>


  {/* Tabela de Responsáveis */}
  <div className="max-h-[400px] overflow-auto rounded-md border border-border">

    <table className="w-full border-collapse text-sm">

      <thead className="sticky top-0 bg-brand-navy text-primary-foreground">
        <tr className="text-left text-[11px] tracking-wide uppercase">

          <th className="px-3 py-3 font-semibold">
            Responsável
          </th>

          <th className="px-2 py-3 text-right font-semibold">
            Total Leituras
          </th>

          <th className="px-2 py-3 text-right font-semibold">
            Em Aberto
          </th>

          <th className="px-2 py-3 text-right font-semibold">
            Concluídas
          </th>

          <th className="px-2 py-3 text-right font-semibold">
            Defeituoso
          </th>

        </tr>
      </thead>

      <tbody>

        {responsaveis.map((r) => (
          <tr
            key={r.responsavel}
            className="border-b border-border last:border-0"
          >

            <td className="px-3 py-2 whitespace-nowrap">
              <span className="font-medium">
                {r.responsavel}
              </span>

              <span
                className={`ml-2 font-semibold ${getPercentualColor(
                  r.percentual_concluido
                )}`}
              >
                {r.percentual_concluido}%
              </span>
            </td>

            <td className="px-2 py-2 text-right">
              {nf.format(r.total_leituras)}
            </td>

            <td className="px-2 py-2 text-right text-brand-red">
              {nf.format(r.falta)}
            </td>

            <td className="px-2 py-2 text-right text-brand-green">
              {nf.format(r.feito)}
            </td>

            <td className="px-2 py-2 text-right">
              {nf.format(r.defeituoso)}
            </td>

          </tr>
        ))}

        {responsaveis.length === 0 && (
          <tr>
            <td
              colSpan={5}
              className="px-3 py-6 text-center text-muted-foreground"
            >
              Nenhum responsável encontrado.
            </td>
          </tr>
        )}

      </tbody>

    </table>

  </div>

</div>

    </div>
  </DialogContent>
</Dialog>
  );
}
