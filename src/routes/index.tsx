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


import { useQuery } from "@tanstack/react-query";
import {
  getOperacaoDiariaTotal,
  getOperacaoDiariaPorCat,
  getOperacaoDiariaDataHora,
  getOperacaoDiariaLote,
  getOperacaoDiariaPorLeiturista,
  getOperacaoDiariaPorResponsavel,
} from "@/api/operacao-diaria";

import { 
  getCodificacaoTotal,
  getCodificacaoDiariaPorCat,
  getCodificacaoDiariaPorLeiturista,
  getCodificacaoDiariaPorCodigo,
 } from "@/api/codificacao-diaria";

import { DetailModal } from "@/components/dashboard/DetailModal";

import { CodificacaoModal } from "@/components/dashboard/CodificacaoModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acompanhamento Diário Leitura | Ceneged" },
      {
        name: "description",
        content:
          "Painel de acompanhamento diário da evolução de leitura e repescagem, com indicadores por município, leiturista e ADM.",
      },
      {
        property: "og:title",
        content: "Acompanhamento Diário Leitura | Ceneged",
      },
      {
        property: "og:description",
        content:
          "Evolução da leitura e repescagem em tempo real, com dados importados do SAP.",
      },
    ],
  }),
  component: Index,
});



function Index() {
  const [aberto, setAberto] = useState<
  "evolucao" | "repescagem" | "codificacao-leitura" | "codificacao-repescagem" | null
  >(null);

  // =========================
  // DATA E HORA
  // =========================

  const dataHoraQuery = useQuery({
    queryKey: ["operacao-diaria-data-hora"],
    queryFn: getOperacaoDiariaDataHora,
  });

  const dataHora = dataHoraQuery.data;

  const dataHoraFormatada =
    dataHora?.data && dataHora?.hora
      ? `${dataHora.data.split("-").reverse().join("/")} ${dataHora.hora}`
      : "Sem dados";


  // =========================
  // TOTAL OPERAÇÃO DIÁRIA
  // =========================

  const operacaoQuery = useQuery({
    queryKey: ["operacao-diaria", false],
    queryFn: () => getOperacaoDiariaTotal(false),
  });

  const repescagemQuery = useQuery({
    queryKey: ["operacao-diaria", true],
    queryFn: () => getOperacaoDiariaTotal(true),
  });


  // =========================
  // OPERAÇÃO DIÁRIA POR CAT
  // =========================

  const operacaoCatQuery = useQuery({
    queryKey: ["operacao-diaria-por-cat", false],
    queryFn: () => getOperacaoDiariaPorCat(false),
  });

  const repescagemCatQuery = useQuery({
    queryKey: ["operacao-diaria-por-cat", true],
    queryFn: () => getOperacaoDiariaPorCat(true),
  });


  // =========================
  // DADOS PRINCIPAIS
  // =========================

  const operacao = operacaoQuery.data;
  const dadosRepescagem = repescagemQuery.data;


  // =========================
  // PAINEL LEITURA
  // =========================

  const painelOperacao = operacao
    ? {
        titulo: "Leitura",
        percentual_concluido: operacao.percentual_concluido,
        total_leituras: operacao.total_leituras,
        feito: operacao.feito,
        falta: operacao.falta,
        defeituoso: operacao.defeituoso,
        cats: operacaoCatQuery.data ?? [],
      }
    : null;

    const operacaoResponsavelQuery = useQuery({
      queryKey: ["operacao-diaria-por-responsavel", false],
      queryFn: () => getOperacaoDiariaPorResponsavel(false),
    });

    const repescagemResponsavelQuery = useQuery({
      queryKey: ["operacao-diaria-por-responsavel", true],
      queryFn: () => getOperacaoDiariaPorResponsavel(true),
    });


  // =========================
  // PAINEL REPESCAGEM
  // =========================

  const painelRepescagem = dadosRepescagem
    ? {
        titulo: "Repescagem",
        percentual_concluido: dadosRepescagem.percentual_concluido,
        total_leituras: dadosRepescagem.total_leituras,
        feito: dadosRepescagem.feito,
        falta: dadosRepescagem.falta,
        defeituoso: dadosRepescagem.defeituoso,
        cats: repescagemCatQuery.data ?? [],
      }
    : null;

    const operacaoLeituristaQuery = useQuery({
        queryKey: ["operacao-diaria-por-leiturista", false],
        queryFn: () => getOperacaoDiariaPorLeiturista(false),
      });

      const repescagemLeituristaQuery = useQuery({
        queryKey: ["operacao-diaria-por-leiturista", true],
        queryFn: () => getOperacaoDiariaPorLeiturista(true),
      });


  // =========================
  // CODIFICAÇÃO
  // =========================

  const codificacaoQuery = useQuery({
    queryKey: ["codificacao-diaria-total"],
    queryFn: getCodificacaoTotal,
  });

  const codificacao = codificacaoQuery.data;


  const loteQuery = useQuery({
  queryKey: ["operacao-diaria-lote"],
  queryFn: getOperacaoDiariaLote,
});

  const lotes = loteQuery.data;

const codificacaoCatQuery = useQuery({
  queryKey: ["codificacao-diaria-por-cat"],
  queryFn: getCodificacaoDiariaPorCat,
});

const codificacaoLeituristaQuery = useQuery({
  queryKey: ["codificacao-diaria-por-leiturista"],
  queryFn: getCodificacaoDiariaPorLeiturista,
});

const codificacaoCodigoQuery = useQuery({
  queryKey: ["codificacao-diaria-por-codigo"],
  queryFn: getCodificacaoDiariaPorCodigo,
});

const codificacaoCats = codificacaoCatQuery.data ?? [];
const codificacaoLeituristas = codificacaoLeituristaQuery.data ?? [];
const codificacaoCodigos = codificacaoCodigoQuery.data ?? [];
  // =========================
  // RETURN
  // =========================

 
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

            <p className="text-sm font-semibold">
              {dataHoraFormatada}
            </p>
          </div>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">

          {painelOperacao && (
            <SummaryCard
              painel={painelOperacao}
              codificacao={codificacao?.leitura}
              lote={lotes?.leitura?.lote}
              onOpen={() => setAberto("evolucao")}
              onOpenCodificacao={() => {
                setAberto("codificacao-leitura");
              }}
            />
          )}

          {painelRepescagem && (
            <SummaryCard
              painel={painelRepescagem}
              codificacao={codificacao?.repescagem}
              lote={lotes?.repescagem?.lote}
              onOpen={() => setAberto("repescagem")}
              onOpenCodificacao={() => {
                 setAberto("codificacao-repescagem");
              }}
            />
          )}

        </div>
            {painelOperacao && (
              <DetailModal
                painel={painelOperacao}
                cats={operacaoCatQuery.data ?? []}
                lote={lotes?.leitura?.lote}
                leituristas={operacaoLeituristaQuery.data ?? []}
                responsaveis={operacaoResponsavelQuery.data ?? []}
                dataHora={dataHoraFormatada}
                open={aberto === "evolucao"}
                onOpenChange={(v) => {
                  if (!v) setAberto(null);
                }}
              />
            )}

            {painelRepescagem && (
              <DetailModal
                painel={painelRepescagem}
                cats={repescagemCatQuery.data ?? []}
                lote={lotes?.repescagem?.lote}
                leituristas={repescagemLeituristaQuery.data ?? []}
                responsaveis={repescagemResponsavelQuery.data ?? []}
                dataHora={dataHoraFormatada}
                open={aberto === "repescagem"}
                onOpenChange={(v) => {
                  if (!v) setAberto(null);
                }}
              />
            )}

            {painelOperacao && (
              <CodificacaoModal
                tipo="leitura"
                cats={codificacaoCats}
                leituristas={codificacaoLeituristas}
                codigos={codificacaoCodigos}
                lote={lotes?.leitura?.lote}
                dataHora={dataHoraFormatada}
                open={aberto === "codificacao-leitura"}
                onOpenChange={(v) => {
                  if (!v) setAberto(null);
                }}
              />
            )}

            {painelRepescagem && (
              <CodificacaoModal
                tipo="repescagem"
                cats={codificacaoCats}
                leituristas={codificacaoLeituristas}
                codigos={codificacaoCodigos}
                lote={lotes?.repescagem?.lote}
                dataHora={dataHoraFormatada}
                open={aberto === "codificacao-repescagem"}
                onOpenChange={(v) => {
                  if (!v) setAberto(null);
                }}
              />
            )}
      </div>
    </div>
  </main>
);
}