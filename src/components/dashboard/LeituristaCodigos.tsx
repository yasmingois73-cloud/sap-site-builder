import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CodigoUsadoPorLeiturista } from "@/api/codificacao-diaria";
import { toast } from "sonner";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";

interface LeituristaCodigosProps {
  nomeLeiturista: string;
  codigos?: CodigoUsadoPorLeiturista[];
  tipo: "leitura" | "repescagem";
}

export function LeituristaCodigos({ nomeLeiturista, codigos, tipo }: LeituristaCodigosProps) {
  const [filtroForaPadrao, setFiltroForaPadrao] = useState(false);

  // Mostra somente os códigos da aba atual (leitura OU repescagem),
  // nunca os dois misturados.
  const codigosDaAba = (codigos ?? []).filter((c) => c[tipo] > 0);

  const codigosFiltrados = filtroForaPadrao
    ? codigosDaAba.filter((c) => c.codigo_normal === false || c.codigo_normal === null)
    : codigosDaAba;

  const foraDoPadrao = codigosDaAba.filter(
    (c) => c.codigo_normal === false || c.codigo_normal === null,
  );

  const temAlerta = foraDoPadrao.length > 0;

  if (codigosDaAba.length === 0) {
    return <span>{nomeLeiturista}</span>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 text-left hover:underline">
          <span>{nomeLeiturista}</span>
          {temAlerta && <span title="Código fora do padrão">⚠️</span>}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 text-sm" align="start">
        {/* CABEÇALHO E BOTÃO COPIAR TODOS */}
        <div className="mb-2 flex items-center justify-between">
          <p className="font-semibold">Códigos utilizados</p>
          <button
            type="button"
            onClick={() => {
              if (codigosFiltrados.length === 0) return;

              const tituloMenu =
                tipo === "repescagem" ? "Codificação - Repescagem" : "Codificação - Evolução";
              const cabecalho = `${tituloMenu}\n${nomeLeiturista} usou:\n`;

              const textoCompleto = codigosFiltrados
                .map((c) => {
                  const foraPadrao =
                    c.codigo_normal === false || c.codigo_normal === null
                      ? " (Fora do padrão)"
                      : "";
                  // Inclui as instalações no texto copiado, se existirem
                  const textoInstalacoes = c.instalacoes?.length
                    ? `\nInstalações: ${c.instalacoes.join(", ")}`
                    : "";
                  return `${c.codigo} — ${c.descricao ?? "Sem descrição"} — ${c[tipo]} ocorrências${foraPadrao}${textoInstalacoes}`;
                })
                .join("\n\n");

              navigator.clipboard.writeText(cabecalho + textoCompleto);
              toast.success(
                filtroForaPadrao
                  ? "Códigos fora do padrão copiados!"
                  : "Todos os códigos copiados!",
              );
            }}
            className="flex items-center gap-1 rounded bg-muted/60 px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            title="Copiar lista atual"
            disabled={codigosFiltrados.length === 0}
          >
            <span>📋</span> Copiar Todos
          </button>
        </div>

        {/* FILTRO: FORA DO PADRÃO */}
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

        {/* LISTA DE CÓDIGOS EM FORMATO DE CARTÃO */}
        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
          {codigosFiltrados.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">
              Nenhum código encontrado.
            </p>
          )}

          {codigosFiltrados.map((c) => {
            const foraPadrao = c.codigo_normal === false || c.codigo_normal === null;
            const qtdOcorrencias = c[tipo] || 0;

            return (
              <div
                key={c.codigo}
                className={`group relative rounded-xl border border-border/40 bg-background/40 p-4 transition-colors hover:bg-muted/20 ${
                  foraPadrao ? "border-amber-700/50" : ""
                }`}
              >
                {/* Botão de Copiar Individual (Aparece no hover) */}
                <button
                  onClick={() => {
                    const textoForaPadrao = foraPadrao ? " (Fora do padrão)" : "";
                    const textoInstalacoes = c.instalacoes?.length
                      ? `\nInstalações: ${c.instalacoes.join(", ")}`
                      : "";
                    const textoLinha = `${c.codigo} — ${c.descricao ?? "Sem descrição"} — ${qtdOcorrencias} ocorrências${textoForaPadrao}${textoInstalacoes}`;

                    navigator.clipboard.writeText(textoLinha);
                    toast.success("Código copiado para a área de transferência!");
                  }}
                  className="absolute right-2 top-2 rounded p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                  title="Copiar informações deste código"
                >
                  📋
                </button>

                {/* Cabeçalho do Cartão */}
                <div className="pr-6">
                  <p className={`font-bold ${foraPadrao ? "text-amber-500" : "text-foreground"}`}>
                    {c.codigo} — {c.descricao ?? "Sem descrição"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {qtdOcorrencias} {qtdOcorrencias === 1 ? "ocorrência" : "ocorrências"}
                  </p>
                </div>

                {/* Secção de Instalações */}
                {c.instalacoes && c.instalacoes.length > 0 && (
                  <div className="mt-3 border-t border-border/40 pt-3">
                    <p className="mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                      Instalações
                    </p>
                    <div className="space-y-1 text-sm font-medium text-foreground/80">
                      {c.instalacoes.map((instalacao: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, idx: Key | null | undefined) => (
                        <p key={idx}>{instalacao}</p>
                      ))}
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
