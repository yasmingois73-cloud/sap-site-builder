import { useState } from "react";
import { toast } from "sonner"; // Adicionado para notificações de cópia
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { CodigoUsadoPorLeiturista } from "@/api/codificacao-diaria";

interface InstalacaoCodificacao {
  codigo: string;
  instalacao: number | string;
  leiturista: string;
  repescagem: boolean;
}

interface LeituristaCodigosProps {
  nomeLeiturista: string;
  codigos?: CodigoUsadoPorLeiturista[];
  instalacoes?: InstalacaoCodificacao[];
  tipo: "leitura" | "repescagem";
}

export function LeituristaCodigos({
  nomeLeiturista,
  codigos,
  instalacoes,
  tipo,
}: LeituristaCodigosProps) {
  // 1. ESTADO PARA CONTROLAR O FILTRO
  const [filtroForaPadrao, setFiltroForaPadrao] = useState(false);

  const codigosDaAba = (codigos ?? []).filter(
    (c) => c[tipo] > 0,
  );

  const foraDoPadrao = codigosDaAba.filter(
    (c) =>
      c.codigo_normal === false ||
      c.codigo_normal === null,
  );

  const temAlerta = foraDoPadrao.length > 0;

  // 2. APLICAÇÃO DO FILTRO (Alterna entre todos e apenas os anormais)
  const codigosFiltrados = filtroForaPadrao ? foraDoPadrao : codigosDaAba;

  if (codigosDaAba.length === 0) {
    return <span>{nomeLeiturista}</span>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 text-left hover:underline">
          <span>{nomeLeiturista}</span>

          {temAlerta && (
            <span title="Código fora do padrão">
              ⚠️
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 text-sm"
        align="start"
      >
        {/* CABEÇALHO E BOTÃO DE COPIAR TODOS */}
        <div className="mb-2 flex items-center justify-between">
          <p className="font-semibold">
            Códigos utilizados
          </p>
          <button
            type="button"
            disabled={codigosFiltrados.length === 0}
            className="flex items-center gap-1 rounded bg-muted/60 px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            title="Copiar lista atual"
            onClick={() => {
              const tituloMenu = tipo === "repescagem" ? "Codificação - Repescagem" : "Codificação - Evolução";
              const cabecalho = `${tituloMenu}\n${nomeLeiturista} usou:\n`;

              const textoCompleto = codigosFiltrados.map((c) => {
                const isForaPadrao = c.codigo_normal === false || c.codigo_normal === null;
                const textoForaPadrao = isForaPadrao ? " (Fora do padrão)" : "";
                
                // Encontrar instalações deste código específico para enviar para o clipboard
                const instalacoesDoCodigo = (instalacoes ?? []).filter(
                  (item) => item.codigo === c.codigo && item.leiturista === nomeLeiturista && item.repescagem === (tipo === "repescagem")
                );
                
                const textoInstalacoes = instalacoesDoCodigo.length > 0 
                  ? `\nInstalações: ${instalacoesDoCodigo.map(i => i.instalacao).join(", ")}` 
                  : "";
                
                return `${c.codigo} — ${c.descricao ?? "Sem descrição"} — ${c[tipo]} ocorrências${textoForaPadrao}${textoInstalacoes}`;
              }).join("\n\n");

              navigator.clipboard.writeText(cabecalho + textoCompleto);
              toast.success(filtroForaPadrao ? "Códigos fora do padrão copiados!" : "Todos os códigos copiados!");
            }}
          >
            <span>📋</span> Copiar Todos
          </button>
        </div>

        {/* CHECKBOX DO FILTRO */}
        <div className="mb-4 border-b border-border/60 pb-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            <input
              type="checkbox"
              checked={filtroForaPadrao}
              onChange={(e) => setFiltroForaPadrao(e.target.checked)}
              className="h-3.5 w-3.5 cursor-pointer rounded border-border accent-amber-500"
            />
            Mostrar apenas códigos fora do padrão ⚠️
          </label>
        </div>

        {/* LISTA DE CÓDIGOS (Agora usa 'codigosFiltrados' e tem botão copiar individual) */}
        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2">
          {codigosFiltrados.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">Nenhum código encontrado.</p>
          )}

          {codigosFiltrados.map((c) => {
            const instalacoesDoCodigo = (
              instalacoes ?? []
            ).filter(
              (item) =>
                item.codigo === c.codigo &&
                item.leiturista === nomeLeiturista &&
                item.repescagem ===
                  (tipo === "repescagem"),
            );

            const isForaPadrao = c.codigo_normal === false || c.codigo_normal === null;

            return (
              <div
                key={c.codigo}
                className="group relative rounded-lg border border-border/60 p-2.5 transition-colors hover:bg-muted/20"
              >
                {/* BOTÃO DE COPIAR INDIVIDUAL (Aparece ao passar o mouse com "group hover") */}
                <button
                  className="absolute right-2 top-2 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                  title="Copiar informações deste código"
                  onClick={() => {
                    const textoForaPadrao = isForaPadrao ? " (Fora do padrão)" : "";
                    const textoInstalacoes = instalacoesDoCodigo.length > 0 
                      ? `\nInstalações: ${instalacoesDoCodigo.map(i => i.instalacao).join(", ")}` 
                      : "";
                    const textoLinha = `${c.codigo} — ${c.descricao ?? "Sem descrição"} — ${c[tipo]} ocorrências${textoForaPadrao}${textoInstalacoes}`;

                    navigator.clipboard.writeText(textoLinha);
                    toast.success("Código copiado para a área de transferência!");
                  }}
                >
                  📋
                </button>

                <p
                  className={
                    isForaPadrao
                      ? "font-semibold text-amber-700 pr-6"
                      : "font-semibold pr-6" // pr-6 para evitar sobrepor o botão de copiar
                  }
                >
                  {c.codigo} —{" "}
                  {c.descricao ?? "Sem descrição"}
                </p>

                <p className="text-xs text-muted-foreground">
                  {c[tipo]}{" "}
                  {c[tipo] === 1
                    ? "ocorrência"
                    : "ocorrências"}
                </p>

                {instalacoesDoCodigo.length > 0 && (
                  <div className="mt-2 border-t border-border/50 pt-2">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Instalações
                    </p>

                    <div className="space-y-1">
                      {instalacoesDoCodigo.map(
                        (item) => (
                          <p
                            key={`${item.codigo}-${item.instalacao}`}
                            className="text-xs"
                          >
                            {item.instalacao}
                          </p>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}