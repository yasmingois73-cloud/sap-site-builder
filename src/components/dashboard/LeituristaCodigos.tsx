import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { CodigoUsadoPorLeiturista } from "@/api/codificacao-diaria";

interface LeituristaCodigosProps {
  nomeLeiturista: string;
  codigos: CodigoUsadoPorLeiturista[];
  tipo: "leitura" | "repescagem";
}

export function LeituristaCodigos({
  nomeLeiturista,
  codigos,
  tipo,
}: LeituristaCodigosProps) {
  // Mostra somente os códigos da aba atual (leitura OU repescagem),
  // nunca os dois misturados.
  const codigosDaAba = codigos.filter((c) => c[tipo] > 0);

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
        <p className="mb-2 font-semibold">Códigos utilizados</p>

        {codigosDaAba.map((c) => (
          <p
            key={c.codigo}
            className={
              c.codigo_normal === false || c.codigo_normal === null
                ? "text-amber-700"
                : ""
            }
          >
            {c.codigo} — {c.descricao ?? "Sem descrição"} — {c[tipo]}{" "}
            ocorrências
          </p>
        ))}
      </PopoverContent>
    </Popover>
  );
}