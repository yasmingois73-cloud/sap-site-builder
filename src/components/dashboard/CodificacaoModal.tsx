
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Logo } from "./Logo";
import { nf } from "@/lib/dashboard-data";

import type {
  CodificacaoPorLeiturista,
  CodificacaoPorCat,
  CodificacaoPorCodigo,
} from "@/api/codificacao-diaria";

type TipoCodificacao = "leitura" | "repescagem";

type Ordenacao = "leitura" | "repescagem" | null;

interface CodificacaoModalProps {
  tipo: TipoCodificacao;
  cats: CodificacaoPorCat[];
  leituristas: CodificacaoPorLeiturista[];
  codigos: CodificacaoPorCodigo[];
  lote?: string;
  dataHora: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CodificacaoModal({
  tipo,
  cats,
  leituristas,
  codigos,
  lote,
  dataHora,
  open,
  onOpenChange,
}: CodificacaoModalProps) {
  const [busca, setBusca] = useState("");

  // Coluna atualmente utilizada para ordenação
  const [ordenacao, setOrdenacao] = useState<Ordenacao>(null);

  // Direção da ordenação
  const [ordemCrescente, setOrdemCrescente] = useState(false);

  const [hora, dia] = dataHora.split(" ").reverse();

  const titulo =
    tipo === "leitura"
      ? "Codificação - Leitura"
      : "Codificação - Repescagem";

  /*
   * Altera a ordenação.
   *
   * Primeiro clique:
   * maior -> menor
   *
   * Segundo clique:
   * menor -> maior
   */
  const ordenarPor = (campo: Ordenacao) => {
    if (!campo) return;

    if (ordenacao === campo) {
      setOrdemCrescente((valor) => !valor);
    } else {
      setOrdenacao(campo);
      setOrdemCrescente(false);
    }
  };

  const valorCodigo = (codigo: CodificacaoPorCodigo) =>
  tipo === "leitura"
    ? codigo.leitura
    : codigo.repescagem;

const codigosOrdenados = useMemo(
  () =>
    [...codigos].sort(
      (a, b) => valorCodigo(b) - valorCodigo(a)
    ),
  [codigos, tipo],
);

const maiorQuantidade =
  codigosOrdenados.length > 0
    ? valorCodigo(codigosOrdenados[0])
    : 0;

  /*
   * Filtra e ordena os leituristas.
   */
  const leituristasFiltrados = useMemo(() => {
    const resultado = leituristas.filter((l) =>
      l.leiturista
        .toLowerCase()
        .includes(busca.toLowerCase())
    );

    if (!ordenacao) {
      return resultado;
    }

    return [...resultado].sort((a, b) => {
      const valorA =
        ordenacao === "leitura"
          ? a.leitura
          : a.repescagem;

      const valorB =
        ordenacao === "leitura"
          ? b.leitura
          : b.repescagem;

      return ordemCrescente
        ? valorA - valorB
        : valorB - valorA;
    });
  }, [
    leituristas,
    busca,
    ordenacao,
    ordemCrescente,
  ]);

  /*
   * Define qual valor será exibido.
   */
  const valorCodificacao = (l: CodificacaoPorLeiturista) => {
    return tipo === "leitura"
      ? l.leitura
      : l.repescagem;
  };

  /*
   * Indicador visual da ordenação.
   */
  const indicadorOrdenacao = (campo: Ordenacao) => {
    if (ordenacao !== campo) {
      return "";
    }

    return ordemCrescente ? " ↑" : " ↓";
  };

  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          card-gradient
          w-[95vw]
          max-w-[1500px]
          gap-0
          overflow-hidden
          rounded-3xl
          p-0
        "
      >
        {/* CABEÇALHO */}

        <DialogHeader
          className="
            red-gradient
            flex-row
            items-center
            gap-4
            px-6
            py-3
          "
        >
          <Logo className="hidden h-10 w-10 shrink-0 sm:block" />

          <DialogTitle
            className="
              text-xl
              font-semibold
              text-primary-foreground
            "
          >
            {titulo}

            <span
              className="
                ml-2
                text-sm
                font-medium
                opacity-90
              "
            >
              {hora}-{dia} | Lote: {lote ?? "Sem dados"}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* CONTEÚDO - 3 COLUNAS */}

        <div
          className="
            grid
            max-h-[78vh]
            gap-6
            overflow-y-auto
            p-6
            lg:grid-cols-3
          "
        >

          {/* ================================================= */}
          {/* COLUNA 1 - CÓDIGOS POR LEITURISTA */}
          {/* ================================================= */}

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

            <div className="max-h-[500px] overflow-auto rounded-md border border-border">
              <table className="w-full border-collapse text-sm">

                <thead className="sticky top-0 bg-brand-navy text-primary-foreground">
                  <tr className="text-left text-[11px] tracking-wide uppercase">

                    <th className="px-3 py-3 font-semibold">
                      Leiturista
                    </th>

                    <th
                      className="
                        cursor-pointer
                        select-none
                        px-3
                        py-3
                        text-right
                        font-semibold
                        hover:bg-white/10
                      "
                      onClick={() => ordenarPor(tipo)}
                    >
                      Qtd. de códigos{indicadorOrdenacao(tipo)}
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {leituristasFiltrados.map((l) => (
                    <tr
                      key={`${l.leiturista}-${l.cat}`}
                      className="border-b border-border last:border-0"
                    >

                      <td className="px-3 py-2 whitespace-nowrap">
                        {l.leiturista}
                      </td>

                      <td
                        className={`
                          px-3
                          py-2
                          text-right
                          ${
                            tipo === "leitura"
                              ? "text-brand-green"
                              : "text-brand-green"
                          }
                        `}
                      >
                        {nf.format(valorCodificacao(l))}
                      </td>
                    </tr>
                  ))}

                  {leituristasFiltrados.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="
                          px-3
                          py-6
                          text-center
                          text-muted-foreground
                        "
                      >
                        Nenhum leiturista encontrado.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>
            </div>

          </div>

        

          {/* ================================================= */}
          {/* COLUNA 2 - CÓDIGOS POR CAT */}
          {/* ================================================= */}

          <div className="space-y-4">

            <div>
              <p className="text-lg font-semibold tracking-tight">
                CATs
              </p>

              <p className="text-xs text-muted-foreground">
                Desempenho de codificação por CAT
              </p>
            </div>

            <div className="max-h-[500px] space-y-3 overflow-y-auto pr-1">

              {cats.map((cat) => {
                const dados = cat[tipo];

                return (
                  <div
                      key={cat.cat}
                      className="
                        rounded-2xl
                        border
                        border-border/70
                        bg-background/30
                        p-4
                      "
                    >
                      <div className="grid grid-cols-3 items-center gap-3">

                        {/* CAT */}

                        <div className="text-left">
                          <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                            CAT
                          </p>

                          <p className="mt-1 text-base font-bold">
                            {cat.cat}
                          </p>
                        </div>

                        {/* QTD. DE CÓDIGOS */}

                        <div className="text-center">
                          <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                            Qtd. de códigos
                          </p>

                          <p className="mt-1 text-lg font-semibold">
                            {nf.format(dados.codigos)}
                          </p>
                        </div>

                        {/* EFETIVIDADE */}

                        <div className="text-center">
                          <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                            Efetividade
                          </p>

                          <p
                            className={`
                              mt-1
                              text-lg
                              font-semibold
                              ${
                                dados.efetividade >= 99.48
                                  ? "text-brand-green"
                                  : "text-brand-red"
                              }
                            `}
                          >
                            {dados.efetividade.toFixed(2)}%
                          </p>
                        </div>

                      </div>
                    </div>
                );
              })}

              {cats.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Nenhuma CAT encontrada.
                </div>
              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* COLUNA 3 - CÓDIGOS */}
          {/* ================================================= */}

          <div className="space-y-4">

            <div>
              <p className="text-lg font-semibold tracking-tight">
                Códigos
              </p>

              <p className="text-xs text-muted-foreground">
                Distribuição dos códigos
              </p>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">

              {codigosOrdenados.map((codigo) => {

                const percentual =
                  maiorQuantidade > 0
                    ? (valorCodigo(codigo) / maiorQuantidade) * 100
                    : 0;

                return (
                  <div
                    key={codigo.codigo}
                    className="grid grid-cols-[55px_1fr_55px] items-center gap-3"
                  >

                    {/* Código */}
                    <span className="text-sm font-semibold text-foreground">
                      {codigo.codigo}
                    </span>

                    {/* Barra */}
                    <div className="h-3 overflow-hidden rounded-full bg-muted/50">
                      <div
                        className="h-full rounded-full bg-brand-green transition-all"
                        style={{
                          width: `${percentual}%`,
                        }}
                      />
                    </div>

                    {/* Quantidade */}
                    <span className="text-right text-sm font-semibold">
                      {nf.format(valorCodigo(codigo))}
                    </span>

                  </div>
                );
              })}

              {codigosOrdenados.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Nenhum código encontrado.
                </div>
              )}

            </div>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}

