import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { FileEdit, ArrowRight, FolderKanban, Clock, CheckCircle2 } from "lucide-react";
import { PROJECTS, MOCK_REQUESTS } from "@/lib/ptr-data";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const ativos = PROJECTS.filter((p) => p.status === "em_execucao").length;
  const pendentes = MOCK_REQUESTS.filter((r) => r.status === "em_analise" || r.status === "pendente").length;
  const assinatura = MOCK_REQUESTS.filter((r) => r.status === "aguardando_assinatura").length;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Bem-vinda, Renata 👋</h1>
        <p className="text-muted-foreground mt-1">Acompanhe seus projetos e solicitações de ajuste de PTR.</p>
      </header>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<FolderKanban className="size-5" />} label="Projetos em execução" value={ativos} />
        <StatCard icon={<Clock className="size-5" />} label="Solicitações em análise" value={pendentes} />
        <StatCard icon={<CheckCircle2 className="size-5" />} label="Aguardando sua assinatura" value={assinatura} highlight />
      </div>

      <Link
        to="/central-solicitacoes"
        className="group block rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.32_0.14_256)] text-primary-foreground p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-80 mb-2">
              <FileEdit className="size-4" /> Central de Solicitações
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold">Solicitar Ajuste de PTR</h2>
            <p className="opacity-85 mt-2 max-w-xl">
              Selecione o projeto, confirme o prazo do dia 10 e envie sua solicitação de forma rápida e organizada.
            </p>
          </div>
          <ArrowRight className="size-8 opacity-80 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </div>
  );
}

function StatCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border bg-card p-5 ${highlight ? "ring-2 ring-primary/30" : ""}`}>
      <div className="flex items-center gap-2 text-muted-foreground text-sm">{icon}<span>{label}</span></div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}
