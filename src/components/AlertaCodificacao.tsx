import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  if (!mostrarAlerta) return null;

  return (
    <Popover
      onOpenChange={(open) => {
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
          "
        >
          ⚠️ Atenção
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 text-sm"
        align="end"
      >
        <p className="mb-3 font-semibold">
          Códigos fora do padrão
        </p>

        {codigosForaDoPadrao.map((c) => (
          <div
            key={c.codigo}
            className="mb-3 last:mb-0"
          >
            <p className="font-medium">
              {c.codigo} —{" "}
              {c.descricao ?? "Sem descrição"}
            </p>

            <p className="text-xs text-muted-foreground">
              {c.quantidadeNova} nova
              {c.quantidadeNova !== 1 ? "s" : ""}{" "}
              ocorrência
              {c.quantidadeNova !== 1 ? "s" : ""}
            </p>

            <div className="mt-2 space-y-2">
              {c.novasOcorrencias.map(
                (ocorrencia, index) => (
                  <div
                    key={`${c.codigo}-${ocorrencia.identificador}-${index}`}
                    className="
                      rounded-md
                      bg-muted/40
                      px-2
                      py-1.5
                    "
                  >
                    <p className="text-xs">
                      👤 {ocorrencia.leiturista}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      🏠 Instalação:{" "}
                      {ocorrencia.instalacao}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}