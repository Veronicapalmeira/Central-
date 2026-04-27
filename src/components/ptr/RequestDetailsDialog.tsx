import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AdjustmentRequest } from "@/lib/ptr-data";

export function RequestDetailsDialog({ request, open, onClose }: { request: AdjustmentRequest | null; open: boolean; onClose: () => void }) {
  if (!request) return null;

  const payload = request.payload ?? {};

  const sectionTitles: Record<string, string> = {
    inclusao: "Inclusão de Bolsista",
    valor: "Ajuste no Valor da Bolsa",
    anulacaoBolsa: "Anulação em Outras Bolsas",
    prorrogacao: "Prorrogação de Vigência",
    reducao: "Redução de Vigência",
    carga: "Ajuste de Carga Horária",
    suplementacao: "Suplementação de Rubrica",
    anulacaoRubrica: "Anulação em Rubrica",
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da solicitação — {request.id}</DialogTitle>
          <DialogDescription>
            {request.projectName} • Enviada em {request.createdAt}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {Object.keys(payload).length === 0 && (
            <div className="text-sm text-muted-foreground">Nenhum detalhe disponível para esta solicitação.</div>
          )}

          {Object.entries(payload).map(([key, section]) => (
            <div key={key} className="rounded-lg border p-3 bg-card">
              <div className="font-semibold">{sectionTitles[key] ?? key}</div>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                {section.inclusionLines && Array.isArray(section.inclusionLines) && (
                  <div className="space-y-1">
                    {section.inclusionLines.map((l: any, i: number) => (
                      <div key={i} className="flex justify-between">
                        <div>
                          <div className="font-medium">{l.nome}</div>
                          <div>CPF: {l.cpf} • Vínculo: {l.vinculo}</div>
                          <div>Início: {l.inicio} • Parcelas: {l.parcelas}</div>
                        </div>
                        <div className="text-right">{l.ch}h • R$ {l.valor}</div>
                      </div>
                    ))}
                  </div>
                )}

                {section.lines && Array.isArray(section.lines) && (
                  <ul className="list-disc pl-4 space-y-1">
                    {section.lines.map((ln: any, idx: number) => (
                      <li key={idx}>{ln.text}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RequestDetailsDialog;
