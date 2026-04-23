import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PROJECTS, MOCK_REQUESTS, STATUS_LABEL, type Project, type AdjustmentRequest, type RequestStatus } from "@/lib/ptr-data";
import { Search, Calendar, User2, ArrowRight, Plus, History, FileSignature, ChevronLeft, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { AcceptDeadlineDialog } from "@/components/ptr/AcceptDeadlineDialog";
import { RequestForm } from "@/components/ptr/RequestForm";
import { SignDocumentDialog } from "@/components/ptr/SignDocumentDialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/central-solicitacoes/ajuste-ptr")({
  head: () => ({
    meta: [
      { title: "Solicitações de Ajuste de PTR — Portal CEIA" },
      { name: "description", content: "Solicite ajustes no Plano de Trabalho dos seus projetos." },
    ],
  }),
  component: SolicitacoesPTRPage,
});

function SolicitacoesPTRPage() {
  const [query, setQuery] = useState("");
  const [acceptingProject, setAcceptingProject] = useState<Project | null>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const projects = useMemo(
    () => PROJECTS.filter((p) => p.status === "em_execucao" && p.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  if (openProject) {
    return (
      <ProjectRequestView
        project={openProject}
        onBack={() => setOpenProject(null)}
      />
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-wider text-primary font-semibold">Central de Solicitações</div>
        <h1 className="text-3xl font-bold tracking-tight mt-1">Solicitações de Ajuste de PTR</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Selecione um dos seus projetos em execução para abrir uma nova solicitação ou acompanhar o histórico.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar projeto..."
            className="w-full h-11 pl-10 pr-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="text-sm text-muted-foreground hidden md:block">
          {projects.length} {projects.length === 1 ? "projeto" : "projetos"} em execução
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setAcceptingProject(p)}
            className="text-left group rounded-2xl border bg-card hover:border-primary/40 hover:shadow-md transition-all p-5 flex flex-col"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-primary-soft text-primary">
                Em execução
              </span>
              <span className="text-[11px] text-muted-foreground">{p.role}</span>
            </div>
            <h3 className="font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
              {p.name}
            </h3>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><User2 className="size-4" /> {p.coordinator}</div>
              <div className="flex items-center gap-2"><Calendar className="size-4" /> {p.vigencia}</div>
            </div>
            <div className="mt-5 pt-4 border-t flex items-center justify-between text-sm font-medium text-primary">
              <span>Abrir solicitação</span>
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed p-10 text-center text-muted-foreground">
            Nenhum projeto encontrado.
          </div>
        )}
      </div>

      <AcceptDeadlineDialog
        project={acceptingProject}
        onClose={() => setAcceptingProject(null)}
        onAccept={(p: Project) => {
          setAcceptingProject(null);
          setOpenProject(p);
        }}
      />
    </div>
  );
}

function ProjectRequestView({ project, onBack }: { project: Project; onBack: () => void }) {
  const [tab, setTab] = useState<"nova" | "historico">("nova");
  const projectRequests = MOCK_REQUESTS.filter((r) => r.projectId === project.id);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="size-4" /> Voltar para projetos
      </button>

      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-primary font-semibold">Ajuste de PTR</div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">{project.name}</h1>
        <div className="text-sm text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <span>Coordenação: {project.coordinator}</span>
          <span>Vigência: {project.vigencia}</span>
        </div>
      </div>

      <div className="border-b mb-6 flex gap-1">
        <TabButton active={tab === "nova"} onClick={() => setTab("nova")} icon={<Plus className="size-4" />}>
          Nova Solicitação
        </TabButton>
        <TabButton active={tab === "historico"} onClick={() => setTab("historico")} icon={<History className="size-4" />}>
          Histórico {projectRequests.length > 0 && <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">{projectRequests.length}</span>}
        </TabButton>
      </div>

      {tab === "nova" ? (
        <RequestForm project={project} onSubmitted={() => setTab("historico")} />
      ) : (
        <HistoryList requests={projectRequests} project={project} />
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
        active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      <span className="truncate">{children}</span>
    </button>
  );
}

function HistoryList({ requests, project }: { requests: AdjustmentRequest[]; project: Project }) {
  const [signing, setSigning] = useState<AdjustmentRequest | null>(null);
  const [signedIds, setSignedIds] = useState<string[]>([]);
  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
        Nenhuma solicitação anterior para este projeto.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {requests.map((r) => {
        const isSigned = signedIds.includes(r.id);
        const status: RequestStatus = isSigned ? "concluido" : r.status;
        return (
        <div
          key={r.id}
          className={cn(
            "rounded-xl border bg-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition",
            status === "aguardando_assinatura" &&
              "border-[color:var(--status-signature)] ring-2 ring-[color:color-mix(in_oklab,var(--status-signature)_35%,transparent)] bg-[color:color-mix(in_oklab,var(--status-signature)_8%,var(--card))]"
          )}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">{r.id}</span>
              <StatusBadge status={status} />
              {status === "aguardando_assinatura" && (
                <span className="relative inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[color:var(--status-signature)] text-[color:var(--status-signature-fg)]">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--status-signature-fg)] opacity-75 animate-ping" />
                    <span className="relative inline-flex size-2 rounded-full bg-[color:var(--status-signature-fg)]" />
                  </span>
                  Pronto para assinar
                </span>
              )}
            </div>
            <div className="text-sm font-medium">Solicitação enviada em {r.createdAt}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {r.topics.join(" • ")}
            </div>
            {status === "aguardando_assinatura" && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-[color:var(--status-signature-fg)]" />
                Carta pronta — assine para concluir o ajuste do PTR.
              </div>
            )}
            {isSigned && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-[color:var(--status-approved-fg)]">
                <CheckCircle2 className="size-3.5" />
                Carta assinada via ZapSign.
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {status === "aguardando_assinatura" && (
              <button
                onClick={() => setSigning(r)}
                className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--status-signature-fg)] text-white px-4 py-2 text-sm font-semibold hover:opacity-90 shadow-sm"
              >
                <FileSignature className="size-4" /> Assinar carta
              </button>
            )}
            <button className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent">
              Ver detalhes
            </button>
          </div>
        </div>
        );
      })}
      {signing && (
        <SignDocumentDialog
          request={signing}
          projectName={project.name}
          signerName={project.coordinator}
          onClose={() => setSigning(null)}
          onSigned={(id) => setSignedIds((prev) => [...prev, id])}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const map: Record<RequestStatus, { bg: string; fg: string; icon?: React.ReactNode }> = {
    pendente: { bg: "var(--status-pending)", fg: "var(--status-pending-fg)" },
    em_analise: { bg: "var(--status-pending)", fg: "var(--status-pending-fg)", icon: <Clock /> },
    aprovado: { bg: "var(--status-approved)", fg: "var(--status-approved-fg)", icon: <CheckCircle2 className="size-3" /> },
    aguardando_assinatura: { bg: "var(--status-signature)", fg: "var(--status-signature-fg)", icon: <FileSignature className="size-3" /> },
    concluido: { bg: "var(--status-approved)", fg: "var(--status-approved-fg)", icon: <CheckCircle2 className="size-3" /> },
    recusado: { bg: "var(--status-rejected)", fg: "var(--status-rejected-fg)", icon: <AlertCircle className="size-3" /> },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `color-mix(in oklab, ${s.bg} 25%, transparent)`, color: s.fg }}
    >
      {s.icon}{STATUS_LABEL[status]}
    </span>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}