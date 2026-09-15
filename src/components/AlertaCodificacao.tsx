import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAlertaCodificacao } from "@/hooks/useAlertaCodificacao";

export function AlertaCodificacao({ tipo }: { tipo: "leitura" | "repescagem" }) {
  const { mostrarAlerta, codigosForaDoPadrao, reconhecer } = useAlertaCodificacao(tipo);

  if (!mostrarAlerta) return null;

  return (
    <Popover onOpenChange={(open) => !open && reconhecer()}>
      <PopoverTrigger asChild>
        <button
          className="
            rounded-full border border-amber-300 bg-amber-100
            px-2.5 py-1 text-xs font-medium text-amber-800
          "
        >
          ⚠️ Atenção
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72 text-sm" align="end">
        <p className="mb-2 font-semibold">Códigos fora do padrão</p>

        {codigosForaDoPadrao.map((c) => (
          <p key={c.codigo}>
            {c.codigo} — {c.descricao ?? "Sem descrição"} — {c[tipo]} ocorrências
          </p>
        ))}
      </PopoverContent>
    </Popover>
  );
}
