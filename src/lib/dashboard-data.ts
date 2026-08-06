export type Municipio = {
  nome: string;
  percentual: number;
  totalLeituras: number;
  concluidas: number;
  emAberto: number;
};

export type Leiturista = {
  nome: string;
  total: number;
  emAberto: number;
  concluidas: number;
  registrados: number;
};

export type Adm = {
  nome: string;
  percentual: number;
  totalLeituras: number;
  emAberto: number;
  concluidas: number;
  registrados: number;
};

export type Painel = {
  id: "evolucao" | "repescagem";
  titulo: string;
  lote: string;
  totalEmAberto: number;
  totalLeituras: number;
  concluidas: number;
  emAberto: number;
  percentual: number;
  municipios: Municipio[];
  leituristas: Leiturista[];
  adms: Adm[];
};

export const dataHora = "06/08/26 08:01:17";

export const importacoes = ["06/08/26 08:01:17", "05/08/26 08:03:42", "04/08/26 07:58:10"];

export const tiposPlanilha = ["Evolução Leitura", "Repescagem", "Consolidado"];

export const evolucao: Painel = {
  id: "evolucao",
  titulo: "Evolução Leitura",
  lote: "Lote 03_24",
  totalEmAberto: 96297,
  totalLeituras: 106415,
  concluidas: 10118,
  emAberto: 96297,
  percentual: 9.51,
  municipios: [
    { nome: "FORTALEZA - WHILNERLLINGTON", percentual: 8.33, totalLeituras: 32625, concluidas: 2717, emAberto: 29908 },
    { nome: ".FORTALEZA - ERISON", percentual: 8.27, totalLeituras: 29463, concluidas: 2438, emAberto: 27025 },
    { nome: "ITAITINGA - ANA PAULA", percentual: 8.86, totalLeituras: 27944, concluidas: 2477, emAberto: 25467 },
    { nome: "CAUCAIA - SILVIA CRISTINA", percentual: 17.56, totalLeituras: 10385, concluidas: 1824, emAberto: 8561 },
    { nome: "BATURITE - SABRINA", percentual: 11.04, totalLeituras: 5998, concluidas: 662, emAberto: 5336 },
  ],
  leituristas: [
    { nome: "JOSE ELDER JULIO COSTA SILVA", total: 389, emAberto: 389, concluidas: 0, registrados: 0 },
    { nome: "WESLLEY PEREIRA DIAS", total: 0, emAberto: 0, concluidas: 0, registrados: 0 },
    { nome: "PEDRO PAULO DE SOUSA SILVA", total: 0, emAberto: 0, concluidas: 0, registrados: 0 },
    { nome: "PAULO ROMERIO MARCELINO MENDON", total: 446, emAberto: 446, concluidas: 0, registrados: 0 },
    { nome: "FRANCISCO ALEX DA SILVA GOMES", total: 0, emAberto: 0, concluidas: 0, registrados: 0 },
    { nome: "CARLOS ROMARIO SOARES ROCHA", total: 347, emAberto: 264, concluidas: 82, registrados: 1 },
    { nome: "ANDRE BESERRA SANTOS", total: 374, emAberto: 373, concluidas: 0, registrados: 1 },
    { nome: "MANUEL EDSON DA SILVA NETO", total: 272, emAberto: 109, concluidas: 162, registrados: 1 },
    { nome: "LUIZ ROBERTO MONTEIRO MAGALHAE", total: 250, emAberto: 198, concluidas: 52, registrados: 0 },
    { nome: "HELIOMAR FREIRE DA SILVA FILHO", total: 411, emAberto: 411, concluidas: 0, registrados: 0 },
    { nome: "CARLOS ALEXANDRE DOS SANTOS SI", total: 262, emAberto: 262, concluidas: 0, registrados: 0 },
    { nome: "JOSE ACELIO CANDIDO DA COSTA", total: 514, emAberto: 335, concluidas: 179, registrados: 0 },
    { nome: "FRANCISCO DE ASSIS NUNES NASCI", total: 317, emAberto: 317, concluidas: 0, registrados: 0 },
  ],
  adms: [
    { nome: "RUTH", percentual: 11.04, totalLeituras: 5998, emAberto: 5336, concluidas: 653, registrados: 9 },
    { nome: ".FISCAL", percentual: 3.74, totalLeituras: 1870, emAberto: 1800, concluidas: 67, registrados: 3 },
    { nome: "PEDRO", percentual: 7.73, totalLeituras: 14227, emAberto: 13127, concluidas: 1100, registrados: 0 },
    { nome: "YASMIN", percentual: 9.49, totalLeituras: 13366, emAberto: 12098, concluidas: 1268, registrados: 0 },
    { nome: "JAIR", percentual: 7.3, totalLeituras: 17794, emAberto: 16495, concluidas: 1299, registrados: 0 },
    { nome: "FISCAL", percentual: 2.54, totalLeituras: 3944, emAberto: 3844, concluidas: 95, registrados: 5 },
    { nome: "RENAN", percentual: 12.11, totalLeituras: 10887, emAberto: 9569, concluidas: 1318, registrados: 0 },
    { nome: "FRANCILANE E CINTIA", percentual: 17.56, totalLeituras: 10385, emAberto: 8561, concluidas: 1789, registrados: 35 },
    { nome: "LIVIA E LUIS", percentual: 8.86, totalLeituras: 27944, emAberto: 25467, concluidas: 2426, registrados: 51 },
  ],
};

export const repescagem: Painel = {
  id: "repescagem",
  titulo: "Repescagem",
  lote: "Lote 02_23",
  totalEmAberto: 2750,
  totalLeituras: 102912,
  concluidas: 100162,
  emAberto: 2750,
  percentual: 97.33,
  municipios: [
    { nome: "ITAITINGA - ANA PAULA", percentual: 95.04, totalLeituras: 24512, concluidas: 23296, emAberto: 1216 },
    { nome: "FORTALEZA - WHILNERLLINGTON", percentual: 97.32, totalLeituras: 32303, concluidas: 31438, emAberto: 865 },
    { nome: ".FORTALEZA - ERISON", percentual: 97.76, totalLeituras: 29673, concluidas: 29007, emAberto: 666 },
    { nome: "BATURITE - SABRINA", percentual: 99.96, totalLeituras: 6795, concluidas: 6792, emAberto: 3 },
    { nome: "CAUCAIA - SILVIA CRISTINA", percentual: 100, totalLeituras: 9629, concluidas: 9629, emAberto: 0 },
  ],
  leituristas: [
    { nome: "JOSE ELDER JULIO COSTA SILVA", total: 634, emAberto: 0, concluidas: 634, registrados: 0 },
    { nome: "WESLLEY PEREIRA DIAS", total: 0, emAberto: 0, concluidas: 0, registrados: 0 },
    { nome: "PEDRO PAULO DE SOUSA SILVA", total: 0, emAberto: 0, concluidas: 0, registrados: 0 },
    { nome: "PAULO ROMERIO MARCELINO MENDON", total: 253, emAberto: 0, concluidas: 250, registrados: 3 },
    { nome: "FRANCISCO ALEX DA SILVA GOMES", total: 0, emAberto: 0, concluidas: 0, registrados: 0 },
    { nome: "CARLOS ROMARIO SOARES ROCHA", total: 469, emAberto: 0, concluidas: 467, registrados: 2 },
    { nome: "ANDRE BESERRA SANTOS", total: 587, emAberto: 0, concluidas: 575, registrados: 12 },
    { nome: "MANUEL EDSON DA SILVA NETO", total: 223, emAberto: 0, concluidas: 223, registrados: 0 },
    { nome: "LUIZ ROBERTO MONTEIRO MAGALHAE", total: 471, emAberto: 2, concluidas: 469, registrados: 0 },
    { nome: "HELIOMAR FREIRE DA SILVA FILHO", total: 498, emAberto: 1, concluidas: 495, registrados: 2 },
    { nome: "CARLOS ALEXANDRE DOS SANTOS SI", total: 418, emAberto: 0, concluidas: 418, registrados: 0 },
    { nome: "JOSE ACELIO CANDIDO DA COSTA", total: 568, emAberto: 0, concluidas: 568, registrados: 0 },
    { nome: "FRANCISCO DE ASSIS NUNES NASCI", total: 282, emAberto: 0, concluidas: 275, registrados: 7 },
  ],
  adms: [
    { nome: "RUTH", percentual: 99.96, totalLeituras: 6795, emAberto: 3, concluidas: 67500, registrados: 42 },
    { nome: ".FISCAL", percentual: 78.43, totalLeituras: 2643, emAberto: 570, concluidas: 20630, registrados: 10 },
    { nome: "PEDRO", percentual: 99.35, totalLeituras: 14157, emAberto: 92, concluidas: 140650, registrados: 0 },
    { nome: "YASMIN", percentual: 99.97, totalLeituras: 12873, emAberto: 4, concluidas: 128690, registrados: 0 },
    { nome: "JAIR", percentual: 95.41, totalLeituras: 17350, emAberto: 797, concluidas: 165530, registrados: 0 },
    { nome: "FISCAL", percentual: 99.54, totalLeituras: 3671, emAberto: 17, concluidas: 36250, registrados: 29 },
    { nome: "RENAN", percentual: 99.55, totalLeituras: 11282, emAberto: 51, concluidas: 112310, registrados: 0 },
    { nome: "FRANCILANE E CINTIA", percentual: 100, totalLeituras: 9629, emAberto: 0, concluidas: 94240, registrados: 205 },
    { nome: "LIVIA E LUIS", percentual: 95.04, totalLeituras: 24512, emAberto: 1216, concluidas: 230750, registrados: 221 },
  ],
};

export function barTone(pct: number): "low" | "mid" | "done" {
  if (pct >= 100) return "done";
  if (pct >= 50) return "mid";
  return "low";
}

export const nf = new Intl.NumberFormat("pt-BR");
