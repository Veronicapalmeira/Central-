import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { FileEdit, ArrowRight, FolderKanban, Clock, CheckCircle2 } from "lucide-react";
import { PROJECTS, MOCK_REQUESTS, BOLSA_SLOTS } from "@/lib/ptr-data";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const ativos = PROJECTS.filter((p) => p.status === "em_execucao").length;
  const pendentes = MOCK_REQUESTS.filter((r) => r.status === "em_analise" || r.status === "pendente").length;
  const assinatura = MOCK_REQUESTS.filter((r) => r.status === "aguardando_assinatura").length;

  const cargaAtual = BOLSA_SLOTS.filter((s) => s.ocupante).reduce((sum, s) => sum + s.ch, 0);
  const disponibilidade = BOLSA_SLOTS.filter((s) => !s.ocupante).reduce((sum, s) => sum + s.ch, 0);

  const chPorProjeto = PROJECTS.map((p) => ({
    id: p.id,
    name: p.name,
    ch: BOLSA_SLOTS.filter((s) => s.projectId === p.id && s.ocupante).reduce((sum, s) => sum + s.ch, 0),
  }));

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">DASHBOARD</h1>
        <p className="text-muted-foreground mt-1">Visão geral dos seus projetos, bolsas e cargas horárias.</p>
      </header>

      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FolderKanban className="size-5" />} label="Projetos ativos" value={ativos} subtitle="Projetos em andamento" />
        <StatCard icon={<Clock className="size-5" />} label="Carga horária atual (h)" value={cargaAtual} subtitle="Soma da carga horária mensal dos projetos ativos" />
        <StatCard icon={<FileEdit className="size-5" />} label="Disponibilidade (h)" value={disponibilidade} subtitle="Horas restantes" />
        <StatCard icon={<CheckCircle2 className="size-5" />} label="Aguardando sua assinatura" value={assinatura} subtitle="Itens esperando sua assinatura" highlight />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Vínculo de bolsas ativos</h2>
            <div className="text-muted-foreground">Total: {BOLSA_SLOTS.filter((s) => s.ocupante).length}</div>
          </div>
          <div className="mt-4 grid gap-2">
            {BOLSA_SLOTS.filter((s) => s.ocupante).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-md border bg-background">
                <div>
                  <div className="font-medium">{s.ocupante?.nome} — {s.funcao}</div>
                  <div className="text-sm text-muted-foreground">Projeto: {PROJECTS.find((p) => p.id === s.projectId)?.name}</div>
                </div>
                <div className="text-sm">{s.ch}h</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sm:col-span-1 rounded-2xl border bg-card p-6">
          <h3 className="text-lg font-semibold">Carga horária por projeto</h3>
          <ul className="mt-4 space-y-3">
            {chPorProjeto.map((p) => (
              <li key={p.id} className="flex items-center justify-between">
                <span className="text-sm">{p.name}</span>
                <strong>{p.ch}h</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtitle, highlight }: { icon: React.ReactNode; label: string; value: number; subtitle?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border bg-card p-5 ${highlight ? "ring-2 ring-primary/30" : ""}`}>
      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <span className="truncate">{label}</span>
        <div className="ml-2">{icon}</div>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="text-3xl font-semibold">{value}</div>
      </div>
      {subtitle ? (
        <div className="mt-2 text-sm text-muted-foreground text-center w-full">{subtitle}</div>
      ) : null}
    </div>
  );
}
