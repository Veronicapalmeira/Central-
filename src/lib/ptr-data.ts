export type ProjectStatus = "em_execucao" | "encerrado" | "prospeccao";

export type Project = {
  id: string;
  name: string;
  client: string;
  coordinator: string;
  role: "Coordenador" | "Vice-Coordenador";
  status: ProjectStatus;
  funding: string;
  vigencia: string;
};

/** Vaga (slot) de bolsa prevista no PTR de um projeto. */
export type BolsaSlot = {
  id: string;
  projectId: string;
  /** Função/posto previsto no plano (ex.: "Pesquisador Sênior", "Bolsista DTI-A"). */
  funcao: string;
  /** Carga horária mensal prevista. */
  ch: number;
  /** Valor mensal da bolsa em reais. */
  valor: number;
  /** Vigência prevista da vaga. */
  vigencia: string;
  /** Fonte do recurso. */
  fonte: string;
  /** Se está ocupada, dados do bolsista. Caso contrário, vaga em aberto. */
  ocupante?: {
    nome: string;
    cpf: string;
    /** Mês/ano de início da bolsa atual. */
    inicio: string;
    /** Quantos meses de bolsa restam até o fim da vigência. */
    mesesRestantes: number;
  };
};

/** Estrutura hierárquica: rubrica e suas subrubricas. */
export type RubricaNode = {
  rubrica: string;
  subrubricas: string[];
};

export const RUBRICAS_TREE: RubricaNode[] = [
  {
    rubrica: "DIÁRIAS",
    subrubricas: [
      "Diárias Internacionais (**) - alimentação, locomoção e hospedagem",
      "Diárias Nacionais (*) - alimentação, locomoção e hospedagem",
    ],
  },
  {
    rubrica: "PASSAGENS E LOCOMOÇÃO",
    subrubricas: [
      "Passagens e despesas de locomoção Internacionais",
      "Passagens e despesas de locomoção Nacionais",
    ],
  },
  {
    rubrica: "SERVIÇOS DE TERCEIROS - PESSOA JURÍDICA",
    subrubricas: ["Taxas Bancárias"],
  },
  {
    rubrica: "MATERIAL DE CONSUMO",
    subrubricas: ["Material de Consumo"],
  },
  {
    rubrica: "DESPESAS DE SUPORTE OPERACIONAL",
    subrubricas: ["Suporte Operacional UE", "Bolsistas - Suporte Operacional", "D.A.O. FUNAPE"],
  },
  {
    rubrica: "RESSARCIMENTO IFES",
    subrubricas: ["Compensação financeira pela cessão de eventual inovação tecnológica"],
  },
];

/** Selecção que pode ser uma rubrica completa ou uma subrubrica específica. */
export type RubricaSelection = {
  rubrica: string;
  subrubrica?: string;
  /** Texto canônico para exibir/usar em formulários. */
  label: string;
};

export const PROJECTS: Project[] = [
  { id: "p1", name: "Sistema de Navegação Autônoma para VANTs", client: "EMBRAPII", coordinator: "Erika Morais", role: "Coordenador", status: "em_execucao", funding: "EMBRAPII", vigencia: "01/03/2024 — 28/02/2026" },
  { id: "p2", name: "IA para Detecção de Plágio Acadêmico", client: "SEBRAE", coordinator: "Renata Braga", role: "Coordenador", status: "em_execucao", funding: "SEBRAE", vigencia: "01/06/2024 — 31/05/2026" },
  { id: "p3", name: "Plataforma Wave Testing", client: "EMPRESA", coordinator: "Juliana Costa", role: "Vice-Coordenador", status: "em_execucao", funding: "EMPRESA", vigencia: "15/01/2025 — 14/01/2027" },
  { id: "p4", name: "Portal CEIA — Gestão de Projetos", client: "CEIA / UFG", coordinator: "Anderson Lima", role: "Coordenador", status: "em_execucao", funding: "CEIA", vigencia: "01/02/2025 — 31/01/2026" },
  { id: "p5", name: "Análise de Imagens Médicas com Deep Learning", client: "EMBRAPII", coordinator: "Renata Braga", role: "Coordenador", status: "encerrado", funding: "EMBRAPII", vigencia: "01/01/2023 — 31/12/2024" },
];

/** Slots de bolsa por projeto (mock). Em produção viria do backend. */
export const BOLSA_SLOTS: BolsaSlot[] = [
  // p1 — VANTs
  { id: "p1-s1", projectId: "p1", funcao: "Pesquisador Sênior", ch: 20, valor: 4000, vigencia: "12 meses", fonte: "EMBRAPII",
    ocupante: { nome: "Erika Morais", cpf: "123.456.789-00", inicio: "03/2024", mesesRestantes: 5 } },
  { id: "p1-s2", projectId: "p1", funcao: "Bolsista DTI-A", ch: 40, valor: 3000, vigencia: "18 meses", fonte: "EMBRAPII",
    ocupante: { nome: "Pedro Augusto Lima", cpf: "987.654.321-00", inicio: "04/2024", mesesRestantes: 9 } },
  { id: "p1-s3", projectId: "p1", funcao: "Bolsista DTI-B", ch: 30, valor: 2200, vigencia: "12 meses", fonte: "EMBRAPII" },
  { id: "p1-s4", projectId: "p1", funcao: "Bolsista IC", ch: 20, valor: 700, vigencia: "12 meses", fonte: "EMBRAPII" },

  // p2 — Plágio
  { id: "p2-s1", projectId: "p2", funcao: "Pesquisador Sênior", ch: 20, valor: 4500, vigencia: "24 meses", fonte: "SEBRAE",
    ocupante: { nome: "Renata Braga", cpf: "111.222.333-44", inicio: "06/2024", mesesRestantes: 13 } },
  { id: "p2-s2", projectId: "p2", funcao: "Bolsista DTI-A", ch: 40, valor: 3000, vigencia: "12 meses", fonte: "SEBRAE",
    ocupante: { nome: "Luiz Miguel Costa", cpf: "333.333.333-33", inicio: "07/2024", mesesRestantes: 2 } },
  { id: "p2-s3", projectId: "p2", funcao: "Bolsista DTI-B", ch: 30, valor: 2200, vigencia: "12 meses", fonte: "SEBRAE" },

  // p3 — Wave Testing
  { id: "p3-s1", projectId: "p3", funcao: "Líder Técnico", ch: 20, valor: 5000, vigencia: "24 meses", fonte: "EMPRESA",
    ocupante: { nome: "Juliana Costa", cpf: "555.666.777-88", inicio: "01/2025", mesesRestantes: 20 } },
  { id: "p3-s2", projectId: "p3", funcao: "Bolsista DTI-A", ch: 40, valor: 3500, vigencia: "12 meses", fonte: "EMPRESA" },
  { id: "p3-s3", projectId: "p3", funcao: "Bolsista IC", ch: 20, valor: 700, vigencia: "12 meses", fonte: "EMPRESA",
    ocupante: { nome: "Ana Beatriz Souza", cpf: "999.888.777-66", inicio: "02/2025", mesesRestantes: 9 } },

  // p4 — Portal CEIA
  { id: "p4-s1", projectId: "p4", funcao: "Líder Técnico", ch: 20, valor: 4500, vigencia: "12 meses", fonte: "CEIA",
    ocupante: { nome: "Anderson Lima", cpf: "444.555.666-77", inicio: "02/2025", mesesRestantes: 9 } },
  { id: "p4-s2", projectId: "p4", funcao: "Bolsista DTI-A", ch: 40, valor: 3000, vigencia: "12 meses", fonte: "CEIA" },
  { id: "p4-s3", projectId: "p4", funcao: "Bolsista DTI-B", ch: 30, valor: 2200, vigencia: "12 meses", fonte: "CEIA" },
];

export type RequestStatus = "pendente" | "em_analise" | "aprovado" | "aguardando_assinatura" | "concluido" | "recusado";

export type AdjustmentRequest = {
  id: string;
  projectId: string;
  projectName: string;
  createdAt: string;
  status: RequestStatus;
  topics: string[];
  /** Payload mock do formulário submetido (para visualização de detalhes) */
  payload?: Record<string, any>;
};

export const MOCK_REQUESTS: AdjustmentRequest[] = [
  {
    id: "REQ-2025-014",
    projectId: "p2",
    projectName: "IA para Detecção de Plágio Acadêmico",
    createdAt: "08/04/2025",
    status: "aguardando_assinatura",
    topics: ["Inclusão de Bolsista", "Suplementação de Rubrica"],
    payload: {
      inclusao: {
        active: true,
        inclusionLines: [
          { nome: "João Silva", cpf: "222.333.444-55", vinculo: "Contratado", ch: 20, parcelas: 12, valor: 1500, inicio: "05/2025" },
        ],
      },
      suplementacao: {
        active: true,
        lines: [
          { text: "Suplementar R$ 10.000 na rubrica de Material de Consumo - Fonte EMBRAPII" },
        ],
      },
    },
  },
  {
    id: "REQ-2025-009",
    projectId: "p2",
    projectName: "IA para Detecção de Plágio Acadêmico",
    createdAt: "10/03/2025",
    status: "concluido",
    topics: ["Prorrogação de Vigência"],
    payload: {
      prorrogacao: { active: true, lines: [{ text: "Acrescentar 6 parcelas para Renata Braga" }] },
    },
  },
  {
    id: "REQ-2025-021",
    projectId: "p1",
    projectName: "Sistema de Navegação Autônoma para VANTs",
    createdAt: "09/04/2025",
    status: "em_analise",
    topics: ["Ajuste de Valor de Bolsa", "Anulação de Bolsas"],
    payload: {
      valor: { active: true, lines: [{ text: "Aumentar bolsa de Erika Morais de R$ 4.000 para R$ 4.500" }] },
      anulacaoBolsa: { active: true, lines: [{ text: "Reduzir 2 parcelas de Pedro Augusto Lima" }] },
    },
  },
  {
    id: "REQ-2025-007",
    projectId: "p3",
    projectName: "Plataforma Wave Testing",
    createdAt: "02/03/2025",
    status: "recusado",
    topics: ["Inclusão de Bolsista Externo"],
    payload: {
      inclusao: { active: true, inclusionLines: [{ nome: "Maria Oliveira", cpf: "777.888.999-00", vinculo: "Colaborador Externo", ch: 20, parcelas: 6, valor: 1200, inicio: "03/2025" }] },
    },
  },
];

export const STATUS_LABEL: Record<RequestStatus, string> = {
  pendente: "Pendente",
  em_analise: "Em Análise",
  aprovado: "Aprovado",
  aguardando_assinatura: "Aguardando Assinatura",
  concluido: "Concluído",
  recusado: "Recusado",
};