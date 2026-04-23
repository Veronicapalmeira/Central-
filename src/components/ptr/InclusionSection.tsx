import { useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Search,
  UserPlus,
  FilePlus2,
  FileEdit,
  ListChecks,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Database,
  UserCircle2,
  Info,
  RotateCcw,
} from "lucide-react";
import type { Project, BolsaSlot } from "@/lib/ptr-data";
import { BOLSA_SLOTS } from "@/lib/ptr-data";
import { cn } from "@/lib/utils";
import { TALENTS, type Talent } from "./TalentSearch";
import { NewSlotDialog, type NewSlotDraft } from "./NewSlotDialog";

/**
 * Linha de inclusão. Cada linha representa UM bolsista a incluir.
 * Quatro origens:
 *  - "slot-vazio": coordenador escolheu um slot livre.
 *  - "slot-ocupado": coordenador escolheu um slot ocupado (substituição/distrato).
 *  - "blank": linha avulsa, sem slot.
 *  - "novo-slot": proposta de criação de novo slot + alocação.
 */
export type InclusionLine = {
  id: string;
  source: "slot-vazio" | "slot-ocupado" | "blank" | "novo-slot";
  /** Texto livre do template editável (frase única). */
  text: string;
  /** Slot relacionado quando aplicável. */
  slot?: BolsaSlot;
  /** Talento selecionado do banco (se houver). */
  talent?: Talent;
  /** Proposta de novo slot. */
  novoSlot?: NewSlotDraft;
  /** Atividades obrigatórias para este novo bolsista. */
  atividades: string[];
  /** Para externo: bloco de justificativa em texto único. */
  externoText?: string;
};

const uid = () => Math.random().toString(36).slice(2, 9);
const brl = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ============= Templates =============
function templateSlot(slot: BolsaSlot, talent?: Talent): string {
  const nome = talent?.name ?? "[Nome do bolsista]";
  const cpf = talent?.cpf ?? "[CPF]";
  const vinc = talent?.vinculo ?? "[Vínculo]";
  return `${nome} (${vinc}): incluir bolsa de R$ ${brl(slot.valor)}, carga horária mensal de ${slot.ch}h e vigência de [mês/ano] a [mês/ano] ([nº] parcelas). CPF ${cpf}. Fonte ${slot.fonte}.`;
}
function templateSubstituicao(slot: BolsaSlot, talent?: Talent): string {
  const nome = talent?.name ?? "[Nome do novo bolsista]";
  const vinc = talent?.vinculo ?? "[Vínculo]";
  const cpf = talent?.cpf ?? "[CPF]";
  return `SUBSTITUIÇÃO da vaga atualmente ocupada por ${slot.ocupante!.nome}: realizar o distrato da bolsa atual (R$ ${brl(slot.valor)}, ${slot.ch}h/mês, fonte ${slot.fonte}) e incluir ${nome} (${vinc}), CPF ${cpf}, com bolsa de R$ ${brl(slot.valor)}, carga horária mensal de ${slot.ch}h e vigência de [mês/ano] a [mês/ano] ([nº] parcelas). Fonte ${slot.fonte}.`;
}
function templateBlank(): string {
  return "[Nome do bolsista] ([Vínculo]): incluir bolsa de R$ [valor], carga horária mensal de [00]h e vigência de [mês/ano] a [mês/ano] ([nº] parcelas). CPF [000.000.000-00]. Fonte [FONTE].";
}
function templateNovoSlot(d: NewSlotDraft, talent?: Talent): string {
  const nome = talent?.name ?? "[Nome do bolsista]";
  const cpf = talent?.cpf ?? "[CPF]";
  const vinc = talent?.vinculo ?? "[Vínculo]";
  const valor = d.voluntaria ? "voluntária (sem bolsa)" : `R$ ${brl(Number(d.chMensal || 0) * d.valorHora)}`;
  return `NOVO SLOT — ${d.cargoFuncao || "[Cargo/Função]"} (${d.areaCompetencia || "[Área]"}, ${d.nivel || "[Nível]"}, titulação mínima ${d.titulacao || "[Titulação]"}). Incluir ${nome} (${vinc}), CPF ${cpf}, com ${valor}/mês, carga horária mensal de ${d.chMensal || "[CH]"}h, duração de ${d.duracao || "[duração]"} meses a partir do mês ${d.mesInicio || "[mês]"}. Fonte ${d.fonte || "[FONTE]"}.`;
}
function templateExterno(talent?: Talent): string {
  const nome = talent?.name ?? "[Nome do pesquisador externo]";
  const formacao = talent?.formacao ?? "[Formação acadêmica]";
  return `${nome} — Formação: ${formacao}. Qualificação: [descreva a experiência relacionada às atividades do projeto, conforme exigência da FUNAPE].`;
}

// ============= Componente principal =============
export function InclusionSection({
  project,
  lines,
  onChange,
}: {
  project: Project;
  lines: InclusionLine[];
  onChange: (lines: InclusionLine[]) => void;
}) {
  const [picker, setPicker] = useState<"none" | "slot" | "novo">("none");
  const [confirmOccupied, setConfirmOccupied] = useState<BolsaSlot | null>(null);
  const [editingActivitiesFor, setEditingActivitiesFor] = useState<string | null>(null);

  // Externos: derivado de lines (qualquer linha com talent.externo OU externoText preenchido)
  const externoLines = lines.filter((l) => l.talent?.externo || l.externoText !== undefined);

  function addLine(line: Omit<InclusionLine, "id" | "atividades">) {
    onChange([...lines, { ...line, id: uid(), atividades: [] }]);
  }
  function updateLine(id: string, patch: Partial<InclusionLine>) {
    onChange(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function removeLine(id: string) {
    onChange(lines.filter((l) => l.id !== id));
  }

  function pickSlot(slot: BolsaSlot) {
    setPicker("none");
    if (slot.ocupante) {
      setConfirmOccupied(slot);
      return;
    }
    addLine({ source: "slot-vazio", slot, text: templateSlot(slot) });
  }
  function confirmOccupiedSlot() {
    if (!confirmOccupied) return;
    addLine({ source: "slot-ocupado", slot: confirmOccupied, text: templateSubstituicao(confirmOccupied) });
    setConfirmOccupied(null);
  }
  function addBlank() {
    addLine({ source: "blank", text: templateBlank() });
  }

  function attachTalent(lineId: string, talent: Talent) {
    const line = lines.find((l) => l.id === lineId);
    if (!line) return;
    let newText = line.text;
    if (line.source === "slot-vazio" && line.slot) newText = templateSlot(line.slot, talent);
    else if (line.source === "slot-ocupado" && line.slot) newText = templateSubstituicao(line.slot, talent);
    else if (line.source === "novo-slot" && line.novoSlot) newText = templateNovoSlot(line.novoSlot, talent);
    else if (line.source === "blank") {
      newText = `${talent.name} (${talent.vinculo}): incluir bolsa de R$ [valor], carga horária mensal de [00]h e vigência de [mês/ano] a [mês/ano] ([nº] parcelas). CPF ${talent.cpf}. Fonte [FONTE].`;
    }
    updateLine(lineId, {
      talent,
      text: newText,
      externoText: talent.externo ? templateExterno(talent) : line.externoText,
    });
  }

  function detachTalent(lineId: string) {
    const line = lines.find((l) => l.id === lineId);
    if (!line) return;
    let newText = line.text;
    if (line.source === "slot-vazio" && line.slot) newText = templateSlot(line.slot);
    else if (line.source === "slot-ocupado" && line.slot) newText = templateSubstituicao(line.slot);
    else if (line.source === "novo-slot" && line.novoSlot) newText = templateNovoSlot(line.novoSlot);
    else if (line.source === "blank") newText = templateBlank();
    updateLine(lineId, { talent: undefined, text: newText, externoText: undefined });
  }

  // Helpers para externos
  function toggleExternoManual(lineId: string) {
    const line = lines.find((l) => l.id === lineId);
    if (!line) return;
    updateLine(lineId, { externoText: line.externoText === undefined ? templateExterno(line.talent) : undefined });
  }

  return (
    <div className="space-y-4">
      {/* Painel de orientação */}
      

      {/* Botões de ação principais */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <ActionButton
          icon={<UserPlus className="size-4" />}
          title="Slot existente"
          subtitle="Vazio ou ocupado"
          onClick={() => setPicker(picker === "slot" ? "none" : "slot")}
          active={picker === "slot"}
        />
        <ActionButton
          icon={<FilePlus2 className="size-4" />}
          title="Propor novo slot"
          subtitle="Cria vaga + bolsista"
          onClick={() => setPicker("novo")}
        />
        <ActionButton
          icon={<FileEdit className="size-4" />}
          title="Linha em branco"
          subtitle="Preenchimento manual"
          onClick={addBlank}
        />
        
      </div>

      {/* Slot picker inline */}
      {picker === "slot" && (
        <SlotPickerInline
          projectId={project.id}
          onPick={pickSlot}
          onClose={() => setPicker("none")}
        />
      )}

      {/* Confirmação de slot ocupado */}
      {confirmOccupied && (
        <div className="rounded-xl border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/30 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-sm">Esta vaga já está ocupada</div>
              <p className="text-xs text-muted-foreground mt-1">
                A vaga <strong>{confirmOccupied.funcao}</strong> está alocada para{" "}
                <strong>{confirmOccupied.ocupante!.nome}</strong> (restam {confirmOccupied.ocupante!.mesesRestantes} meses).
                Para incluir um novo bolsista, será gerada uma <strong>substituição</strong> (distrato da bolsa atual + inclusão do novo).
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={confirmOccupiedSlot}
                  className="rounded-md bg-amber-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-amber-700"
                >
                  Prosseguir com substituição
                </button>
                <button
                  onClick={() => setConfirmOccupied(null)}
                  className="rounded-md border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent inline-flex items-center gap-1"
                >
                  <X className="size-3" /> Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal novo slot */}
      <NewSlotDialog
        open={picker === "novo"}
        onClose={() => setPicker("none")}
        onSave={(d) => {
          // Inject novo-slot line with atividades from draft
          onChange([
            ...lines,
            {
              id: uid(),
              source: "novo-slot",
              novoSlot: d,
              text: templateNovoSlot(d),
              atividades: d.atividades,
            },
          ]);
          setPicker("none");
        }}
      />

      {/* Lista de linhas */}
      {lines.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Nenhum bolsista adicionado ainda. Use uma das 3 opções acima para começar.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {lines.length} bolsista{lines.length > 1 ? "s" : ""} a incluir
          </div>
          {lines.map((line, idx) => (
            <InclusionLineCard
              key={line.id}
              index={idx + 1}
              line={line}
              onChangeText={(t) => updateLine(line.id, { text: t })}
              onChangeExterno={(t) => updateLine(line.id, { externoText: t })}
              onAttachTalent={(t) => attachTalent(line.id, t)}
              onDetachTalent={() => detachTalent(line.id)}
              onToggleExterno={() => toggleExternoManual(line.id)}
              onOpenActivities={() => setEditingActivitiesFor(line.id)}
              onRemove={() => removeLine(line.id)}
            />
          ))}
        </div>
      )}

      {/* Bloco resumo de externos */}
      {externoLines.length > 0 && (
        <div className="rounded-xl border-2 border-primary/30 bg-primary-soft/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="size-4 text-primary" />
            <div className="text-sm font-semibold">
              Serão incluídos {externoLines.length} bolsista{externoLines.length > 1 ? "s" : ""} externo{externoLines.length > 1 ? "s" : ""}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            A justificativa aparece dentro de cada linha de bolsista externo (campo "Bolsista externo — justificativa para FUNAPE"). Edite o texto livremente.
          </p>
        </div>
      )}

      {/* Modal lista de atividades */}
      {editingActivitiesFor && (
        <ActivitiesDialog
          initial={lines.find((l) => l.id === editingActivitiesFor)?.atividades ?? []}
          onClose={() => setEditingActivitiesFor(null)}
          onSave={(atividades) => {
            updateLine(editingActivitiesFor, { atividades });
            setEditingActivitiesFor(null);
          }}
        />
      )}
    </div>
  );
}

// ============= Subcomponents =============

function ActionButton({
  icon,
  title,
  subtitle,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg border-2 px-3 py-3 text-left transition-all hover:shadow-sm",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-primary/30 bg-background hover:border-primary hover:bg-primary-soft/30"
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className={cn("text-[11px] mt-0.5", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
        {subtitle}
      </div>
    </button>
  );
}

function SlotPickerInline({
  projectId,
  onPick,
  onClose,
}: {
  projectId: string;
  onPick: (slot: BolsaSlot) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"todas" | "abertas" | "ocupadas">("todas");
  const all = BOLSA_SLOTS.filter((s) => s.projectId === projectId);
  const empty = all.filter((s) => !s.ocupante).length;
  const occupied = all.length - empty;
  const q = query.trim().toLowerCase();
  const visible = all.filter((s) => {
    if (filter === "abertas" && s.ocupante) return false;
    if (filter === "ocupadas" && !s.ocupante) return false;
    if (!q) return true;
    return s.funcao.toLowerCase().includes(q) || s.fonte.toLowerCase().includes(q) || s.ocupante?.nome.toLowerCase().includes(q);
  });

  return (
    <div className="rounded-xl border-2 border-primary bg-card p-4 shadow-md">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div>
          <div className="text-sm font-semibold">Selecionar slot do projeto</div>
          <div className="text-xs text-muted-foreground">
            {empty} aberta{empty !== 1 ? "s" : ""} • {occupied} ocupada{occupied !== 1 ? "s" : ""}
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent">
          <X className="size-4" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por função, fonte ou ocupante..."
            className="w-full h-9 pl-8 pr-3 rounded-md border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="inline-flex rounded-md border bg-background p-0.5 text-xs">
          {(["todas", "abertas", "ocupadas"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded font-medium capitalize transition-colors",
                filter === f ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto space-y-1.5">
        {visible.map((s) => {
          const isEmpty = !s.ocupante;
          return (
            <button
              key={s.id}
              onClick={() => onPick(s)}
              className={cn(
                "w-full text-left rounded-md border-2 p-2.5 transition-all hover:shadow-sm flex items-center gap-3",
                isEmpty
                  ? "border-dashed border-emerald-400/60 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-500"
                  : "border-amber-400/50 bg-amber-50/40 dark:bg-amber-950/20 hover:border-amber-500"
              )}
            >
              <span
                className={cn(
                  "size-9 rounded-md flex items-center justify-center shrink-0",
                  isEmpty ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                )}
              >
                {isEmpty ? <Plus className="size-4" /> : <UserCircle2 className="size-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium truncate">{s.funcao}</span>
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded",
                      isEmpty ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                    )}
                  >
                    {isEmpty ? "Aberta" : "Ocupada"}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {s.ch}h/mês • R$ {brl(s.valor)} • {s.vigencia} • {s.fonte}
                </div>
                {s.ocupante && (
                  <div className="text-[11px] mt-0.5">
                    <span className="font-medium">{s.ocupante.nome}</span>
                    <span className="text-muted-foreground"> — restam {s.ocupante.mesesRestantes} {s.ocupante.mesesRestantes === 1 ? "mês" : "meses"}</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
        {visible.length === 0 && (
          <div className="text-xs text-muted-foreground italic py-4 text-center">
            Nenhuma vaga encontrada com esses filtros.
          </div>
        )}
      </div>
    </div>
  );
}

function InclusionLineCard({
  index,
  line,
  onChangeText,
  onChangeExterno,
  onAttachTalent,
  onDetachTalent,
  onToggleExterno,
  onOpenActivities,
  onRemove,
}: {
  index: number;
  line: InclusionLine;
  onChangeText: (t: string) => void;
  onChangeExterno: (t: string) => void;
  onAttachTalent: (t: Talent) => void;
  onDetachTalent: () => void;
  onToggleExterno: () => void;
  onOpenActivities: () => void;
  onRemove: () => void;
}) {
  const [talentOpen, setTalentOpen] = useState(false);

  const sourceMeta: Record<InclusionLine["source"], { label: string; cls: string }> = {
    "slot-vazio": { label: "Slot vazio", cls: "bg-emerald-600 text-white" },
    "slot-ocupado": { label: "Substituição", cls: "bg-amber-600 text-white" },
    blank: { label: "Em branco", cls: "bg-muted-foreground text-background" },
    "novo-slot": { label: "Novo slot (proposta)", cls: "bg-primary text-primary-foreground" },
  };
  const meta = sourceMeta[line.source];
  const slotInfo =
    line.source === "novo-slot" && line.novoSlot
      ? `${line.novoSlot.cargoFuncao || "Novo cargo"} · ${line.novoSlot.chMensal || "?"}h · ${line.novoSlot.fonte || "?"}`
      : line.slot
        ? `${line.slot.funcao} · ${line.slot.ch}h · R$ ${brl(line.slot.valor)} · ${line.slot.fonte}`
        : "";

  const hasActivities = line.atividades.length > 0;

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-background overflow-hidden">
      {/* Cabeçalho da linha */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/40 border-b">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
            {index}
          </span>
          <span className={cn("text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded", meta.cls)}>
            {meta.label}
          </span>
          {line.talent?.externo && (
            <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-purple-600 text-white">
              Externo
            </span>
          )}
          {slotInfo && <span className="text-[11px] text-muted-foreground truncate">{slotInfo}</span>}
        </div>
        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors shrink-0"
          title="Remover este bolsista"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Bolsista vinculado / busca no banco */}
        {line.talent ? (
          <div className="flex items-center gap-2 rounded-md bg-primary-soft border border-primary/20 px-3 py-2 text-xs">
            <UserCircle2 className="size-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{line.talent.name}</div>
              <div className="text-[10px] text-muted-foreground truncate">
                {line.talent.vinculo} · {line.talent.cpf} · {line.talent.formacao}
              </div>
            </div>
            <button
              onClick={onDetachTalent}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <X className="size-3" /> Remover
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setTalentOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <Database className="size-3.5" />
              {talentOpen ? "Fechar Banco de Talentos" : "Buscar no Banco de Talentos (opcional)"}
            </button>
            {talentOpen && (
              <div className="mt-2">
                <TalentInlineSearch
                  onPick={(t) => {
                    onAttachTalent(t);
                    setTalentOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Texto editável principal */}
        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">
            Descrição da inclusão
          </label>
          <textarea
            value={line.text}
            onChange={(e) => onChangeText(e.target.value)}
            rows={3}
            className="w-full rounded-md border bg-background p-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          />
        </div>

        {/* Externo: linha única editável */}
        {line.externoText !== undefined && (
          <div className="rounded-md border-2 border-purple-400/40 bg-purple-50/40 dark:bg-purple-950/20 p-3">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="text-[11px] uppercase tracking-wider font-bold text-purple-700 dark:text-purple-400">
                Bolsista externo — justificativa para FUNAPE
              </label>
              {!line.talent?.externo && (
                <button
                  onClick={onToggleExterno}
                  className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <X className="size-3" /> remover
                </button>
              )}
            </div>
            <textarea
              value={line.externoText}
              onChange={(e) => onChangeExterno(e.target.value)}
              rows={2}
              placeholder="Nome — Formação acadêmica. Qualificação relacionada às atividades do projeto."
              className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>
        )}

        {/* Toggle externo manual (linhas em branco / slot existente sem talento externo) */}
        {line.externoText === undefined && !line.talent?.externo && (
          <button
            onClick={onToggleExterno}
            className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <Plus className="size-3" /> Marcar como bolsista externo
          </button>
        )}

        {/* Atividades */}
        <div
          className={cn(
            "rounded-md border p-2.5 flex items-center justify-between gap-2 flex-wrap",
            hasActivities ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300/50" : "bg-amber-50 dark:bg-amber-950/20 border-amber-300/50"
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <ListChecks className={cn("size-4 shrink-0", hasActivities ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400")} />
            <div className="text-xs">
              <span className="font-semibold">Lista de atividades</span>
              <span className="text-muted-foreground">
                {hasActivities
                  ? ` — ${line.atividades.length} cadastrada${line.atividades.length > 1 ? "s" : ""}`
                  : " — obrigatória antes da aprovação"}
              </span>
            </div>
          </div>
          <button
            onClick={onOpenActivities}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              hasActivities
                ? "border bg-background hover:bg-accent"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {hasActivities ? "Editar atividades" : "Definir atividades"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============= Talent search compacto inline =============

function TalentInlineSearch({ onPick }: { onPick: (t: Talent) => void }) {
  const [q, setQ] = useState("");
  const list = q.trim()
    ? TALENTS.filter(
        (t) =>
          t.name.toLowerCase().includes(q.toLowerCase()) ||
          t.cpf.includes(q) ||
          t.email.toLowerCase().includes(q.toLowerCase()) ||
          t.formacao.toLowerCase().includes(q.toLowerCase())
      )
    : TALENTS.slice(0, 5);
  return (
    <div className="rounded-md border bg-card p-2">
      <div className="relative mb-2">
        <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome, CPF, e-mail ou formação..."
          className="w-full h-8 pl-8 pr-3 rounded-md border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="max-h-56 overflow-auto space-y-1">
        {list.map((t) => (
          <button
            key={t.id}
            onClick={() => onPick(t)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent text-left"
          >
            <UserCircle2 className="size-7 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate flex items-center gap-1.5">
                {t.name}
                {t.externo && (
                  <span className="text-[9px] uppercase font-bold px-1 py-0.5 rounded bg-purple-600 text-white">
                    Externo
                  </span>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {t.vinculo} • {t.cpf} • {t.formacao}
              </div>
            </div>
            <Plus className="size-3.5 text-primary shrink-0" />
          </button>
        ))}
        {list.length === 0 && (
          <div className="text-[11px] text-muted-foreground italic text-center py-2">Nenhum talento encontrado.</div>
        )}
      </div>
    </div>
  );
}

// ============= Modal de atividades (reutilizado / simplificado) =============

const SUGESTAO_IA = [
  "Revisar e refinar o modelo de classificação para melhorar a precisão",
  "Desenvolver e implementar uma solução de processamento de imagens",
  "Treinar e ajustar um modelo de visão computacional",
  "Conduzir análise exploratória de dados (EDA) do dataset do projeto",
  "Documentar arquitetura e fluxos para entrega da macroentrega",
];

function ActivitiesDialog({
  initial,
  onClose,
  onSave,
}: {
  initial: string[];
  onClose: () => void;
  onSave: (list: string[]) => void;
}) {
  const [list, setList] = useState<string[]>(initial);

  function update(i: number, v: string) {
    setList((p) => p.map((x, idx) => (idx === i ? v : x)));
  }
  function remove(i: number) {
    setList((p) => p.filter((_, idx) => idx !== i));
  }
  function add() {
    setList((p) => [...p, `Atividade ${p.length + 1}`]);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
              <ListChecks className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Lista de atividades do bolsista</h3>
              <p className="text-xs text-muted-foreground">
                Obrigatória antes da aprovação. Edite, use sugestão de IA ou adicione manualmente.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-2">
          {list.length === 0 && (
            <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
              Nenhuma atividade ainda. Use "Sugestão IA" ou "Adicionar Atividade".
            </div>
          )}
          {list.map((a, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-primary-soft/40 px-3 py-2 group">
              <span className="size-7 shrink-0 rounded-full bg-background text-primary text-xs font-bold flex items-center justify-center border border-primary/30">
                {i + 1}
              </span>
              <input
                value={a}
                onChange={(e) => update(i, e.target.value)}
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
              <button
                onClick={() => remove(i)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}

          <button
            onClick={add}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary/90"
          >
            <Plus className="size-4" /> Adicionar Atividade
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 px-5 py-4 border-t bg-muted/20 rounded-b-2xl">
          <button
            onClick={() => setList(SUGESTAO_IA)}
            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-xs font-semibold hover:bg-accent"
          >
            <Sparkles className="size-3.5 text-primary" /> Sugestão IA
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setList([])}
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium hover:bg-accent"
            >
              <RotateCcw className="size-3" /> Limpar
            </button>
            <button
              onClick={() => onSave(list)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--status-approved)] text-[color:var(--status-approved-fg)] px-4 py-2 text-xs font-semibold hover:opacity-90"
            >
              <CheckCircle2 className="size-3.5" /> Salvar atividades
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
