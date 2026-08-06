import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgressBar } from "./ProgressBar";
import { Gauge } from "./Gauge";
import { Logo } from "./Logo";
import { nf, type Painel } from "@/lib/dashboard-data";

export function DetailModal({
  painel,
  dataHora,
  open,
  onOpenChange,
}: {
  painel: Painel;
  dataHora: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string>("todas");

  const leituristas = useMemo(
    () => painel.leituristas.filter((l) => l.nome.toLowerCase().includes(busca.toLowerCase())),
    [painel.leituristas, busca],
  );

  const [hora, dia] = dataHora.split(" ").reverse();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="card-gradient max-w-[1500px] gap-0 overflow-hidden rounded-3xl p-0">
        <DialogHeader className="red-gradient flex-row items-center gap-4 px-6 py-4">
          <Logo className="hidden h-11 w-11 shrink-0 sm:block" />
          <DialogTitle className="text-xl font-semibold text-primary-foreground">
            {painel.titulo}{" "}
            <span className="ml-2 text-sm font-medium opacity-90">
              {hora}-{dia} | {painel.lote}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid max-h-[78vh] gap-8 overflow-y-auto p-6 lg:grid-cols-3">
          {/* Coluna 1: leituristas */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="w-[190px]">
                  <SelectValue placeholder="Selecione a Cat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  <SelectItem value="residencial">Residencial</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar Leiturista..."
                className="w-[240px]"
              />
            </div>

            <div className="max-h-[430px] overflow-auto rounded-md border border-border">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-brand-navy text-primary-foreground">
                  <tr className="text-left text-[11px] tracking-wide uppercase">
                    <th className="px-3 py-3 font-semibold">Nome Leiturista</th>
                    <th className="px-2 py-3 text-right font-semibold">Total Leit.</th>
                    <th className="px-2 py-3 text-right font-semibold">Em Aberto</th>
                    <th className="px-2 py-3 text-right font-semibold">Conc.</th>
                    <th className="px-2 py-3 text-right font-semibold">Registrados</th>
                  </tr>
                </thead>
                <tbody>
                  {leituristas.map((l) => (
                    <tr key={l.nome} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 whitespace-nowrap">{l.nome}</td>
                      <td className="px-2 py-2 text-right">{nf.format(l.total)}</td>
                      <td className="px-2 py-2 text-right text-brand-red">
                        {nf.format(l.emAberto)}
                      </td>
                      <td className="px-2 py-2 text-right text-brand-green">
                        {nf.format(l.concluidas)}
                      </td>
                      <td className="px-2 py-2 text-right text-bar-mid">
                        {nf.format(l.registrados)}
                      </td>
                    </tr>
                  ))}
                  {leituristas.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                        Nenhum leiturista encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coluna 2: municípios */}
          <div className="space-y-6">
            {painel.municipios.map((m) => (
              <div key={m.nome} className="text-center">
                <p className="text-lg font-semibold tracking-tight">{m.nome}</p>
                <div className="mt-1 flex justify-center gap-8 text-xs text-muted-foreground">
                  <span>Total Leituras</span>
                  <span>Concluídas</span>
                  <span>Em Aberto</span>
                </div>
                <div className="flex justify-center gap-10 text-sm font-medium">
                  <span>{nf.format(m.totalLeituras)}</span>
                  <span>{nf.format(m.concluidas)}</span>
                  <span>{nf.format(m.emAberto)}</span>
                </div>
                <ProgressBar percentual={m.percentual} className="mt-2" />
              </div>
            ))}
          </div>

          {/* Coluna 3: totais + ADM */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center gap-8 text-lg font-bold">
                <span>Total Leituras</span>
                <span className="text-brand-green">Concluídas</span>
                <span className="text-brand-red">Em Aberto</span>
              </div>
              <div className="flex justify-center gap-12 text-base font-medium">
                <span>{nf.format(painel.totalLeituras)}</span>
                <span className="text-brand-green">{nf.format(painel.concluidas)}</span>
                <span className="text-brand-red">{nf.format(painel.emAberto)}</span>
              </div>
              <div className="mt-3 flex justify-center">
                <Gauge percentual={painel.percentual} />
              </div>
            </div>

            <div className="max-h-[360px] overflow-auto rounded-md border border-border">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-brand-navy text-primary-foreground">
                  <tr className="text-left text-[11px] tracking-wide uppercase">
                    <th className="px-3 py-3 font-semibold">Nome ADM</th>
                    <th className="px-2 py-3 text-right font-semibold">Total Leituras</th>
                    <th className="px-2 py-3 text-right font-semibold">Em Aberto</th>
                    <th className="px-2 py-3 text-right font-semibold">Concluídas</th>
                    <th className="px-2 py-3 text-right font-semibold">Registrados</th>
                  </tr>
                </thead>
                <tbody>
                  {painel.adms.map((a) => (
                    <tr key={a.nome} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 whitespace-nowrap">
                        {a.nome} <span className="font-semibold text-brand-red">{a.percentual}%</span>
                      </td>
                      <td className="px-2 py-2 text-right">{nf.format(a.totalLeituras)}</td>
                      <td className="px-2 py-2 text-right text-brand-red">
                        {nf.format(a.emAberto)}
                      </td>
                      <td className="px-2 py-2 text-right text-brand-green">
                        {nf.format(a.concluidas)}
                      </td>
                      <td className="px-2 py-2 text-right text-bar-mid">
                        {nf.format(a.registrados)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
