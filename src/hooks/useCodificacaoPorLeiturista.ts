import { useEffect, useMemo, useState } from "react";
import {
  getCodificacaoDiariaPorLeituristaCodigo,
  type CodificacaoPorLeituristaDetalhe,
} from "@/api/codificacao-diaria";

const normalizar = (nome: string) => nome.trim().toUpperCase();

// Cache simples em memória, compartilhado entre todas as instâncias do hook.
// Antes, cada linha da tabela de leituristas chamava esse hook por conta
// própria e disparava sua PRÓPRIA requisição — com 50 leituristas, eram 50
// requisições simultâneas, daí a lentidão.
// Agora o hook é chamado 1 vez só (no CodificacaoModal) e os dados são
// repassados via props para cada linha. O cache aqui garante ainda que,
// se o modal for aberto de novo (ou os dois modais - Leitura/Repescagem -
// forem montados), não haja nova requisição desnecessária.
let cache: CodificacaoPorLeituristaDetalhe[] | null = null;
let cachePromise: Promise<CodificacaoPorLeituristaDetalhe[]> | null = null;

function buscarComCache() {
  if (cache) {
    return Promise.resolve(cache);
  }

  if (!cachePromise) {
    cachePromise = getCodificacaoDiariaPorLeituristaCodigo()
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

export function useCodificacaoPorLeiturista() {
  const [dados, setDados] = useState<CodificacaoPorLeituristaDetalhe[]>(
    cache ?? [],
  );

  useEffect(() => {
    let ativo = true;

    buscarComCache()
      .then((res) => {
        if (ativo) setDados(res);
      })
      .catch(() => {
        // silencioso: não deve quebrar o modal existente
      });

    return () => {
      ativo = false;
    };
  }, []);

  const mapaPorLeiturista = useMemo(() => {
    const mapa = new Map<string, CodificacaoPorLeituristaDetalhe>();
    dados.forEach((d) => mapa.set(normalizar(d.leiturista), d));
    return mapa;
  }, [dados]);

  const getDadosDoLeiturista = (nomeLeiturista: string) => {
    return mapaPorLeiturista.get(normalizar(nomeLeiturista));
  };

  return { getDadosDoLeiturista };
}