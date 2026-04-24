import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PROJECTS, type Project } from "@/lib/ptr-data";
import { Search, Calendar, User2, ArrowRight, ChevronLeft, Plus, History, Info, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/central-solicitacoes/cadastro-macroentregas")({
  head: () => ({
    meta: [
      { title: "Cadastro de Macroentregas — Portal CEIA" },
      { name: "description", content: "Cadastre macroentregas dos seus projetos." },
    ],
  }),
  component: CadastroMacroentregasPage,
});

function CadastroMacroentregasPage() {
  const [query, setQuery] = useState("");
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
      <Link to="/central-solicitacoes" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground/80 -mt-2 mb-6">
        <ChevronLeft className="size-3" /> Voltar para central de solicitações
      </Link>
      <div className="mb-8">
        <div className="text-xs uppercase tracking-wider text-primary font-semibold">Central de Solicitações</div>
        <h1 className="text-3xl font-bold tracking-tight mt-1">Cadastro de Macroentregas</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Selecione um dos seus projetos em execução para cadastrar as macroentregas.
        </p>
      </div>

      <div className="w-full mb-6">
        <div className="relative w-full">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar projeto..."
            className="w-full h-11 pl-10 pr-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setOpenProject(p)}
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
              <span>Cadastro de macroentregas</span>
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

      {/* Sem modal de aceite nesta tela; clique abre o projeto diretamente */}
    </div>
  );
}

export default CadastroMacroentregasPage;

  function ProjectRequestView({ project, onBack }: { project: Project; onBack: () => void }) {
    const [tab, setTab] = useState<"nova" | "historico">("nova");
    const [submissions, setSubmissions] = useState<any[]>([]);

    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground/80 -mt-2 mb-6">
          <ChevronLeft className="size-3" /> Voltar para projetos
        </button>

        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-primary font-semibold">Cadastro de Macroentregas</div>
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
            Histórico {submissions.length > 0 && <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">{submissions.length}</span>}
          </TabButton>
        </div>

        {tab === "nova" ? (
          <MacroentregaForm
            project={project}
            onSubmitted={(data: any) => {
              setSubmissions((s) => [data, ...s]);
              setTab("historico");
            }}
          />
        ) : (
          <MacroHistoryList submissions={submissions} project={project} />
        )}
      </div>
    );
  }

  function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
    return (
      <button
        onClick={onClick}
        className={cn("flex-1 relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium -mb-px")}
      >
        <div className={cn("flex items-center gap-2", active ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
          {icon}
          <span className="truncate">{children}</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
          <span
            style={{
              display: "block",
              height: "100%",
              backgroundColor: "var(--primary)",
              transform: active ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "center",
              transition: "transform 360ms cubic-bezier(.2,.9,.2,1)",
            }}
          />
        </div>
      </button>
    );
  }

  function MacroentregaForm({ project, onSubmitted }: { project: Project; onSubmitted: (data: any) => void }) {
    const [title, setTitle] = useState("");
    const [macro, setMacro] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [responsible, setResponsible] = useState("");
    const [sent, setSent] = useState(false);
    const [saved, setSaved] = useState<any | null>(null);

    function doSubmit() {
      const data = {
        id: String(Date.now()),
        createdAt: new Date().toLocaleString(),
        title,
        macro,
        startDate,
        endDate,
        responsible,
      };
      setSaved(data);
      setSent(true);
    }

    function submit(e: React.FormEvent) {
      e.preventDefault();
      doSubmit();
    }

    function formatMonthYear(v: string) {
      const digits = v.replace(/\D/g, "").slice(0, 6);
      if (digits.length <= 2) return digits;
      return digits.slice(0, 2) + "/" + digits.slice(2);
    }

    if (sent && saved) {
      return (
        <div className="rounded-2xl border bg-card p-10 text-center">
          <div className="size-14 rounded-full bg-[color:color-mix(in_oklab,var(--status-approved)_25%,transparent)] flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-7 text-[color:var(--status-approved-fg)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h3 className="text-xl font-semibold">Formulário enviado com sucesso!</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">Sua macroentrega foi registrada. Você pode ver o envio no Histórico.</p>
          <button
            onClick={() => {
              onSubmitted(saved);
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90"
          >
            Ver no Histórico
          </button>
        </div>
      );
    }

    function clear() {
      setTitle("");
      setMacro("");
      setStartDate("");
      setEndDate("");
      setResponsible("");
    }

    const canSubmit = title.trim() !== "" && macro.trim() !== "";

    return (
      <>
        <form onSubmit={submit} className="space-y-6">
        <div className="rounded-xl bg-primary-soft text-foreground border border-primary/20 p-4 mb-6 flex items-start gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Info className="size-5 text-primary mt-0.5 shrink-0" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Quando você enviar este formulário, o proprietário verá seu nome e endereço de email.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-sm">Quando você enviar este formulário, o proprietário verá seu nome e endereço de email.</div>
        </div>

        <div className="rounded-xl border bg-white p-6 mb-6">
          <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <div className="text-sm font-medium">1. Título</div>
            <div className="text-xs text-muted-foreground">Ex: Execução de Macroentrega</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Insira sua resposta" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
          </label>

          <label className="block">
            <div className="text-sm font-medium">2. Qual é essa Macroentrega?</div>
            <div className="text-xs text-muted-foreground">Ex: Macro1</div>
            <input value={macro} onChange={(e) => setMacro(e.target.value)} placeholder="Insira sua resposta" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm font-medium">3. Data inicial</div>
              <div className="relative mt-2">
                <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={startDate} onChange={(e) => setStartDate(formatMonthYear(e.target.value))} placeholder="MM/AAAA" inputMode="numeric" maxLength={7} className="w-full rounded-lg border pl-10 pr-3 py-2 bg-white text-foreground" />
              </div>
            </label>
            <label className="block">
              <div className="text-sm font-medium">4. Data Final</div>
              <div className="relative mt-2">
                <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={endDate} onChange={(e) => setEndDate(formatMonthYear(e.target.value))} placeholder="MM/AAAA" inputMode="numeric" maxLength={7} className="w-full rounded-lg border pl-10 pr-3 py-2 bg-white text-foreground" />
              </div>
            </label>
          </div>

          <label className="block">
            <div className="text-sm font-medium">5. Responsável</div>
            <input value={responsible} onChange={(e) => setResponsible(e.target.value)} placeholder="Insira sua resposta" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
          </label>

          {/* Nome e email removidos — informações do usuário serão obtidas pelo sistema */}
          </div>
        </div>

        </form>
        <MacroFloatingBar canSubmit={canSubmit} onSend={doSubmit} onClear={clear} />
      </>
    );
  }

  function MacroHistoryList({ submissions, project }: { submissions: any[]; project: Project }) {
    if (submissions.length === 0) {
      return (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          Nenhuma solicitação anterior para este projeto.
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {submissions.map((s) => (
          <div key={s.id} className="rounded-xl border bg-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{s.title}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.macro} • {s.startDate} — {s.endDate}</div>
              <div className="text-sm mt-2">Responsável: {s.responsible}</div>
              <div className="text-xs text-muted-foreground mt-2">Enviado em {s.createdAt}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent">Ver detalhes</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Floating action bar for the Macroentrega form (Enviar / Limpar)
  function MacroFloatingBar({ canSubmit, onSend, onClear }: { canSubmit: boolean; onSend: () => void; onClear: () => void }) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-10 md:bottom-6 md:max-w-xl md:ml-auto z-30">
        <div className="rounded-2xl border bg-card/95 backdrop-blur shadow-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div />
          <div className="flex items-center gap-2">
            <button onClick={onClear} className="rounded-lg border px-4 py-2">Limpar</button>
            <button
              onClick={onSend}
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Send className="size-4" /> Enviar solicitação
            </button>
          </div>
        </div>
      </div>
    );
  }
