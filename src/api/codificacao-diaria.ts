import { apiFetch } from "./api";

export interface CodificacaoTipo {
  codigos: number;
  efetividade: number;
}

export interface CodificacaoTotal {
  leitura: CodificacaoTipo;
  repescagem: CodificacaoTipo;
}

export function getCodificacaoTotal() {
  return apiFetch<CodificacaoTotal>("/codificacao-diaria/total/");
}

export interface CodificacaoPorCatTipo {
  codigos: number;
  efetividade: number;
}

export interface CodificacaoPorCat {
  cat: string;
  leitura: CodificacaoPorCatTipo;
  repescagem: CodificacaoPorCatTipo;
}

export function getCodificacaoDiariaPorCat() {
  return apiFetch<CodificacaoPorCat[]>("/codificacao-diaria/cat/");
}

export interface CodificacaoPorLeiturista {
  leiturista: string;
  cat: string;
  supervisor: string;
  leitura: number;
  repescagem: number;
  total: number;
}

export function getCodificacaoDiariaPorLeiturista() {
  return apiFetch<CodificacaoPorLeiturista[]>(
    "/codificacao-diaria/leiturista/"
  );
}

export interface CodificacaoPorCodigo {
  codigo: string;
  leitura: number;
  repescagem: number;
  total: number;
}

export function getCodificacaoDiariaPorCodigo() {
  return apiFetch<CodificacaoPorCodigo[]>(
    "/codificacao-diaria/codigo/"
  );
}