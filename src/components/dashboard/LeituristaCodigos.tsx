import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CodigoUsadoPorLeiturista } from "@/api/codificacao-diaria";
import { toast } from "sonner";

interface LeituristaCodigosProps {
  nomeLeiturista: string;
  codigos?: CodigoUsadoPorLeiturista[];
  tipo: "leitura" | "repescagem";
}

export function LeituristaCodigos({ nomeLeiturista, codigos, tipo }: LeituristaCodigosProps) {
  // Mostra somente os códigos da aba atual (leitura OU repescagem),
  // nunca os dois misturados.
  const codigosDaAba = (codigos ?? []).filter((c) => c[tipo] > 0);

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

      <PopoverContent className="w-72 text-sm" align="start">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-semibold">Códigos utilizados</p>
          <button
            type="button"
            onClick={() => {
              // Junta todos os códigos da lista em um texto único separado por quebras de linha
              const textoCompleto = codigosDaAba
                .map(
                  (c) => `${c.codigo} — ${c.descricao ?? "Sem descrição"} — ${c[tipo]} ocorrências`,
                )
                .join("\n");

              navigator.clipboard.writeText(textoCompleto);
              toast.success("Todos os códigos foram copiados!");
            }}
            className="flex items-center gap-1 rounded bg-muted/60 px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Copiar todos os códigos"
          >
            <span>📋</span> Copiar Todos
          </button>
        </div>

        <div className="max-h-60 space-y-1 overflow-y-auto">
          {codigosDaAba.map((c) => (
            <button
              type="button"
              key={c.codigo}
              onClick={() => {
                navigator.clipboard.writeText(c.codigo);
                toast.success(`Código ${c.codigo} copiado para a área de transferência!`);
              }}
              className={`flex w-full items-center justify-between rounded px-1.5 py-1 text-left transition-colors hover:bg-muted/50 group ${
                c.codigo_normal === false || c.codigo_normal === null ? "text-amber-700" : ""
              }`}
              title="Clique para copiar o código"
            >
              <span className="truncate">
                {c.codigo} — {c.descricao ?? "Sem descrição"} — {c[tipo]} ocorrências
              </span>
              <span className="ml-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
                📋
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
