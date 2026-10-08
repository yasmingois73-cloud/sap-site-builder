import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useAlertaCodificacao } from "@/hooks/useAlertaCodificacao";

export function AlertaCodificacao({
  tipo,
}: {
  tipo: "leitura" | "repescagem";
}) {
  const {
    mostrarAlerta,
    codigosForaDoPadrao,
    reconhecer,
  } = useAlertaCodificacao(tipo);

  // O botão só aparece se houver alertas não reconhecidos E se existirem códigos na lista.
  if (!mostrarAlerta || !codigosForaDoPadrao || codigosForaDoPadrao.length === 0) {
    return null;
  }

  return (
    <Popover
      onOpenChange={(open) => {
        // Ao fechar a caixa de informação, dispara a função que oculta o botão
        if (!open) {
          reconhecer();
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          className="
            rounded-full
            border
            border-amber-300
            bg-amber-100
            px-2.5
            py-1
            text-xs
            font-medium
            text-amber-800
            transition-colors
            hover:bg-amber-200
          "
        >
          ⚠️ Atenção
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[340px] text-sm shadow-xl"
        align="center"
        side="top"
        sideOffset={10}
      >
        <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-2">
          <p className="font-semibold text-amber-600">
            Códigos fora do padrão
          </p>
          
          <button
            type="button"
            className="flex items-center gap-1 rounded bg-muted/60 px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Copiar todos os alertas"
            onClick={() => {
              const cabecalho = `⚠️ Alertas de Códigos (${tipo === 'leitura' ? 'Leitura' : 'Repescagem'}):\n\n`;
              const textoCompleto = codigosForaDoPadrao.map((c) => {
                let bloco = `${c.codigo} — ${c.descricao ?? "Sem descrição"} (${c.quantidadeNova} ocorrências)\n`;
                const linhasOcorrencias = c.novasOcorrencias.map(
                  (o) => `  👤 ${o.leiturista} | 🏠 Instalação: ${o.instalacao}`
                ).join("\n");
                return bloco + linhasOcorrencias;
              }).join("\n\n");

              navigator.clipboard.writeText(cabecalho + textoCompleto);
              toast.success("Alertas copiados com sucesso!");
            }}
          >
            <span>📋</span> Copiar Todos
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-4">
          {codigosForaDoPadrao.map((c) => (
            <div
              key={c.codigo}
              className="group relative rounded-lg border border-amber-500/20 bg-amber-500/5 p-3"
            >
              <button
                className="absolute right-2 top-2 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                title="Copiar este código"
                onClick={() => {
                  let texto = `${c.codigo} — ${c.descricao ?? "Sem descrição"} (${c.quantidadeNova} ocorrências)\n`;
                  texto += c.novasOcorrencias.map((o) => `  👤 ${o.leiturista} | 🏠 Instalação: ${o.instalacao}`).join("\n");
                  navigator.clipboard.writeText(texto);
                  toast.success("Código copiado!");
                }}
              >
                📋
              </button>

              <div className="pr-6">
                <p className="font-bold text-amber-700/90 dark:text-amber-500">
                  {c.codigo} — {c.descricao ?? "Sem descrição"}
                </p>

                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                  {c.quantidadeNova} nova{c.quantidadeNova !== 1 ? "s" : ""} ocorrência{c.quantidadeNova !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="mt-3 space-y-2">
                {c.novasOcorrencias.map((ocorrencia, index) => (
                  <div
                    key={`${c.codigo}-${ocorrencia.identificador}-${index}`}
                    className="
                      rounded-md
                      bg-background/80
                      border border-border/50
                      px-2.5
                      py-2
                    "
                  >
                    <p className="text-xs font-medium">
                      👤 {ocorrencia.leiturista}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      🏠 Instalação: {ocorrencia.instalacao}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}