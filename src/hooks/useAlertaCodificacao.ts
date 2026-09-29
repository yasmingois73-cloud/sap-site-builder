import { useEffect, useMemo, useState, useCallback } from "react";
import {
  getCodificacaoDiariaPorCodigo,
  getCodigosReconhecidos,
  marcarCodigosReconhecidos,
  type CodificacaoPorCodigo,
  type CodificacaoOcorrencia,
} from "@/api/codificacao-diaria";

const INTERVALO_ATUALIZACAO_MS = 60_000;

let requisicaoCodigosEmAndamento: Promise<CodificacaoPorCodigo[]> | null =
  null;

function buscarCodigosAtuais() {
  if (!requisicaoCodigosEmAndamento) {
    requisicaoCodigosEmAndamento =
      getCodificacaoDiariaPorCodigo().finally(() => {
        requisicaoCodigosEmAndamento = null;
      });
  }

  return requisicaoCodigosEmAndamento;
}

export function useAlertaCodificacao(
  tipo: "leitura" | "repescagem",
) {
  const [codigos, setCodigos] = useState<CodificacaoPorCodigo[]>([]);

  const [reconhecidos, setReconhecidos] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    let ativo = true;

    const buscarCodigos = () => {
      buscarCodigosAtuais()
        .then((dados) => {
          if (ativo) {
            setCodigos(dados);
          }
        })
        .catch(() => {});
    };

    const buscarReconhecidos = () => {
      getCodigosReconhecidos()
        .then((dados) => {
          if (!ativo) return;

          const conjunto = new Set<string>();

          dados
            .filter((d) => d.tipo === tipo)
            .forEach((d) => {
              conjunto.add(
                `${d.codigo}|${d.identificador}`,
              );
            });

          setReconhecidos(conjunto);
        })
        .catch(() => {});
    };

    buscarCodigos();
    buscarReconhecidos();

    const intervalo = setInterval(() => {
      buscarCodigos();
      buscarReconhecidos();
    }, INTERVALO_ATUALIZACAO_MS);

    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [tipo]);

  const foraDoPadrao = useMemo(
    () =>
      codigos.filter(
        (c) =>
          c[tipo] > 0 &&
          (c.codigo_normal === false ||
            c.codigo_normal === null),
      ),
    [codigos, tipo],
  );

  const pendentes = useMemo(() => {
    return foraDoPadrao
      .map((c) => {
        const ocorrenciasDoTipo =
          c.ocorrencias.filter(
            (ocorrencia) =>
              ocorrencia.repescagem ===
              (tipo === "repescagem"),
          );

        const novasOcorrencias =
          ocorrenciasDoTipo.filter(
            (ocorrencia) =>
              !reconhecidos.has(
                `${c.codigo}|${ocorrencia.identificador}`,
              ),
          );

        if (novasOcorrencias.length === 0) {
          return null;
        }

        return {
          ...c,
          quantidadeNova: novasOcorrencias.length,
          novasOcorrencias,
        };
      })
      .filter(
        (
          item,
        ): item is CodificacaoPorCodigo & {
          quantidadeNova: number;
          novasOcorrencias: CodificacaoOcorrencia[];
        } => item !== null,
      );
  }, [foraDoPadrao, reconhecidos, tipo]);

  const mostrarAlerta = pendentes.length > 0;

  const reconhecer = useCallback(() => {
    if (pendentes.length === 0) return;

    const ocorrenciasParaMarcar =
      pendentes.flatMap((c) =>
        c.novasOcorrencias.map((ocorrencia) => ({
          codigo: c.codigo,
          identificador: ocorrencia.identificador,
        })),
      );

    setReconhecidos((prev) => {
      const novo = new Set(prev);

      ocorrenciasParaMarcar.forEach((ocorrencia) => {
        novo.add(
          `${ocorrencia.codigo}|${ocorrencia.identificador}`,
        );
      });

      return novo;
    });

    marcarCodigosReconhecidos(
      tipo,
      ocorrenciasParaMarcar,
    ).catch(() => {});
  }, [pendentes, tipo]);

  return {
    mostrarAlerta,
    codigosForaDoPadrao: pendentes,
    reconhecer,
  };
}