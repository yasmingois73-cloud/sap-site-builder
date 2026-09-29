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

export interface CodificacaoOcorrencia {
  leiturista: string;
  repescagem: boolean;
  instalacao: number | string;
  identificador: string;
}

export interface CodificacaoPorCodigo {
  codigo: string;
  descricao: string | null;
  codigo_normal: boolean | null;
  leitura: number;
  repescagem: number;
  total: number;
  ocorrencias: CodificacaoOcorrencia[];
}

export function getCodificacaoDiariaPorCodigo() {
  return apiFetch<CodificacaoPorCodigo[]>(
    "/codificacao-diaria/codigo/"
  );
}

export interface CodigoUsadoPorLeiturista {
  codigo: string;
  descricao: string | null;
  codigo_normal: boolean | null;
  leitura: number;
  repescagem: number;
}

export interface CodificacaoPorLeituristaDetalhe {
  leiturista: string;
  codigos: CodigoUsadoPorLeiturista[];
}

export function getCodificacaoDiariaPorLeituristaCodigo() {
  return apiFetch<CodificacaoPorLeituristaDetalhe[]>(
    "/codificacao-diaria/leiturista-codigo/"
  );
}
export interface CodigoReconhecido {
  tipo: "leitura" | "repescagem";
  codigo: string;
  identificador: string;
}

export function getCodigosReconhecidos() {
  return apiFetch<CodigoReconhecido[]>("/alertas-codificacao/reconhecidos/");
}

export async function marcarCodigosReconhecidos(
  tipo: "leitura" | "repescagem",
  ocorrencias: {
    codigo: string;
    identificador: string;
  }[],
  
) {
  console.log(">>> ENVIANDO RECONHECIMENTO <<<");
  console.log(">>> TIPO:", tipo);
  console.log(">>> OCORRENCIAS:", ocorrencias);

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/alertas-codificacao/reconhecidos/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo,
        ocorrencias,
      }),
    },
  );

  console.log(">>> STATUS POST:", response.status);

  if (!response.ok) {
    const erro = await response.text();

    console.error(">>> ERRO POST:", erro);

    throw new Error(
      "Erro ao marcar ocorrências como reconhecidas",
    );
  }

  const resultado = await response.json();

  console.log(">>> POST SALVO:", resultado);

  return resultado;
}