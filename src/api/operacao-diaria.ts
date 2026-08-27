import { apiFetch } from "./api";

export interface OperacaoDiariaTotal {
  repescagem: boolean;
  total_leituras: number;
  feito: number;
  falta: number;
  defeituoso: number;
  percentual_concluido: number;
}

export async function getOperacaoDiariaTotal(
  repescagem: boolean
): Promise<OperacaoDiariaTotal> {
  const response = await fetch(
    `http://localhost:8000/api/operacao-diaria/total/?repescagem=${repescagem}`
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar operação diária: ${response.status}`
    );
  }

  return response.json();
}

export interface OperacaoDiariaCat {
  cat: string;
  supervisor: string;
  total_leituras: number;
  feito: number;
  falta: number;
  defeituoso: number;
  percentual_concluido: number;
}

export async function getOperacaoDiariaPorCat(
  repescagem: boolean
): Promise<OperacaoDiariaCat[]> {
  const response = await fetch(
    `http://localhost:8000/api/operacao-diaria/por-cat/?repescagem=${repescagem}`
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar operação diária por CAT: ${response.status}`
    );
  }

  return response.json();
}

export interface OperacaoDiariaDataHora {
  data: string | null;
  hora: string | null;
}

export function getOperacaoDiariaDataHora() {
  return apiFetch<OperacaoDiariaDataHora>(
    "/operacao-diaria/data-hora/"
  );
}

export interface OperacaoDiariaLote {
  leitura: {
    lote: string | null;
    quantidade: number;
  };
  repescagem: {
    lote: string | null;
    quantidade: number;
  };
}

export function getOperacaoDiariaLote() {
  return apiFetch<OperacaoDiariaLote>("/operacao-diaria/lote/");
}

export interface OperacaoDiariaLeiturista {
  leiturista: string;
  total_leituras: number;
  feito: number;
  falta: number;
  defeituoso: number;
}

export async function getOperacaoDiariaPorLeiturista(
  repescagem: boolean,
): Promise<OperacaoDiariaLeiturista[]> {
  const response = await fetch(
    `http://localhost:8000/api/operacao-diaria/por-leiturista/?repescagem=${repescagem}`,
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar dados por leiturista");
  }

  return response.json();
}

export interface OperacaoDiariaResponsavel {
  responsavel: string;
  total_leituras: number;
  feito: number;
  falta: number;
  defeituoso: number;
  percentual_concluido: number;
}

export async function getOperacaoDiariaPorResponsavel(
  repescagem: boolean,
): Promise<OperacaoDiariaResponsavel[]> {
  const response = await fetch(
    `http://localhost:8000/api/operacao-diaria/por-responsavel/?repescagem=${repescagem}`,
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar dados por responsável");
  }

  return response.json();
}