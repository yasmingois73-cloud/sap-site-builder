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
  const codigosDaAba = (codigos ?? []).filter(
    (c) => c[tipo] > 0,
  );

  const foraDoPadrao = codigosDaAba.filter(
    (c) =>
      c.codigo_normal === false ||
      c.codigo_normal === null,
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
        <p className="mb-3 font-semibold">
          Códigos utilizados
        </p>

        <div className="space-y-3">
          {codigosDaAba.map((c) => {
            const instalacoesDoCodigo = (
              instalacoes ?? []
            ).filter(
              (item) =>
                item.codigo === c.codigo &&
                item.leiturista === nomeLeiturista &&
                item.repescagem ===
                  (tipo === "repescagem"),
            );

            return (
              <div
                key={c.codigo}
                className="rounded-lg border border-border/60 p-2.5"
              >
                <p
                  className={
                    c.codigo_normal === false ||
                    c.codigo_normal === null
                      ? "font-semibold text-amber-700"
                      : "font-semibold"
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