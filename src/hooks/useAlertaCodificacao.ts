import { useEffect, useMemo, useState, useCallback } from "react";
import {
  getCodificacaoDiariaPorCodigo,
  type CodificacaoPorCodigo,
} from "@/api/codificacao-diaria";

// Cache simples em memória — o dashboard principal tem 2 cards
// ("Leitura" e "Repescagem"), cada um com seu próprio <AlertaCodificacao />.
// Sem esse cache, cada card dispararia sua própria requisição. Com o cache,
// só a primeira montagem busca na API; a segunda reaproveita o resultado.
let cache: CodificacaoPorCodigo[] | null = null;
let cachePromise: Promise<CodificacaoPorCodigo[]> | null = null;

function buscarComCache() {
  if (cache) {
    return Promise.resolve(cache);
  }

  if (!cachePromise) {
    cachePromise = getCodificacaoDiariaPorCodigo()
      .then((dados) => {
        cache = dados;
        return dados;
      })
      .finally(() => {
        cachePromise = null;
      });
  }

  return cachePromise;
}

export function useAlertaCodificacao(tipo: "leitura" | "repescagem") {
  const [codigos, setCodigos] = useState<CodificacaoPorCodigo[]>(cache ?? []);
  const [reconhecidos, setReconhecidos] = useState<Set<string>>(new Set());

  useEffect(() => {
    let ativo = true;

    buscarComCache()
      .then((dados) => {
        if (ativo) setCodigos(dados);
      })
      .catch(() => {
        // silencioso: não deve quebrar o dashboard existente
      });

    return () => {
      ativo = false;
    };
  }, []);

  // Só considera códigos fora do padrão que tenham ocorrência NESTA aba
  // (leitura ou repescagem) - não mistura as duas.
  const foraDoPadrao = useMemo(
    () =>
      codigos.filter(
        (c) =>
          c[tipo] > 0 &&
          (c.codigo_normal === false || c.codigo_normal === null),
      ),
    [codigos, tipo],
  );

  // Só os que ainda não foram "vistos" pelo usuário nesta sessão
  const pendentes = useMemo(
    () => foraDoPadrao.filter((c) => !reconhecidos.has(c.codigo)),
    [foraDoPadrao, reconhecidos],
  );

  const mostrarAlerta = pendentes.length > 0;

  const reconhecer = useCallback(() => {
    setReconhecidos((prev) => {
      const novo = new Set(prev);
      foraDoPadrao.forEach((c) => novo.add(c.codigo));
      return novo;
    });
  }, [foraDoPadrao]);

  return { mostrarAlerta, codigosForaDoPadrao: foraDoPadrao, reconhecer };
}