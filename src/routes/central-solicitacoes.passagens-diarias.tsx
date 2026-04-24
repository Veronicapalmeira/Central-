import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Calendar, Plane, Info, Plus, History, ChevronLeft, User2, MapPin, Clock, Settings, Briefcase } from "lucide-react";
import { TalentSearch, type Talent } from "@/components/ptr/TalentSearch";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PROJECTS } from "@/lib/ptr-data";

export const Route = createFileRoute("/central-solicitacoes/passagens-diarias")({
  head: () => ({
    meta: [
      { title: "Passagens e Diárias — Portal CEIA" },
      { name: "description", content: "Solicite passagens e diárias diretamente." },
    ],
  }),
  component: PassagensDiariasPage,
});

function PassagensDiariasPage() {
  const [projectLinked, setProjectLinked] = useState("GESTÃO CEIA: CONTA FUNDO LOCAL");
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerRG, setPassengerRG] = useState("");
  const [passengerCPF, setPassengerCPF] = useState("");
  const [passengerDOB, setPassengerDOB] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [paymentConfirmation, setPaymentConfirmation] = useState(false);

  const [localPartida, setLocalPartida] = useState("");
  const [localChegada, setLocalChegada] = useState("");
  const [missionStart, setMissionStart] = useState("");
  const [missionEnd, setMissionEnd] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [requestKind, setRequestKind] = useState("passagens_e_diarias");

  const [diariaCount, setDiariaCount] = useState("");
  const [includeDesloc, setIncludeDesloc] = useState<boolean | null>(null);

  const [idaDate, setIdaDate] = useState("");
  const [voltaDate, setVoltaDate] = useState("");
  const [international, setInternational] = useState<boolean | null>(null);
  const [transportType, setTransportType] = useState("");
  const [includeBaggage, setIncludeBaggage] = useState(false);
  const [travelInsurance, setTravelInsurance] = useState<boolean | null>(null);
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [emergencyContactAddress, setEmergencyContactAddress] = useState("");
  const [passportNumberIntl, setPassportNumberIntl] = useState("");
  const [passportUploadedConfirm, setPassportUploadedConfirm] = useState(false);

  const [flightRestriction, setFlightRestriction] = useState<boolean | null>(null);
  const [preferredTimes, setPreferredTimes] = useState("");
  const [flightPreference, setFlightPreference] = useState(false);
  const [uploadedConfirm, setUploadedConfirm] = useState(false);

  const [observation, setObservation] = useState("");
  const [activitiesDesc, setActivitiesDesc] = useState("");
  const [justification, setJustification] = useState("");

  const [tab, setTab] = useState<"nova" | "historico">("nova");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [sent, setSent] = useState(false);
  const [saved, setSaved] = useState<any | null>(null);

  function formatDateDDMMYYYY(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
  }

  function clear() {
    setProjectLinked("GESTÃO CEIA: CONTA FUNDO LOCAL");
    setPassengerName("");
    setPassengerEmail("");
    setPassengerRG("");
    setPassengerCPF("");
    setPassengerDOB("");
    setPassengerPhone("");
    setPaymentConfirmation(false);
    setLocalPartida("");
    setLocalChegada("");
    setMissionStart("");
    setMissionEnd("");
    setExpenseType("");
    setRequestKind("passagens_e_diarias");
    setDiariaCount("");
    setIncludeDesloc(null);
    setIdaDate("");
    setVoltaDate("");
    setInternational(false);
    setTransportType("");
    setIncludeBaggage(false);
    setFlightRestriction(false);
    setPreferredTimes("");
    setFlightPreference(false);
    setUploadedConfirm(false);
    setObservation("");
    setActivitiesDesc("");
    setJustification("");
  }

  function submit() {
    const data = {
      projectLinked,
      passengerName,
      passengerEmail,
      passengerRG,
      passengerCPF,
      passengerDOB,
      passengerPhone,
      paymentConfirmation,
      localPartida,
      localChegada,
      missionStart,
      missionEnd,
      expenseType,
      requestKind,
      diariaCount,
      includeDesloc,
      idaDate,
      voltaDate,
      international,
      transportType,
      includeBaggage,
      flightRestriction,
      preferredTimes,
      flightPreference,
      uploadedConfirm,
      observation,
      activitiesDesc,
      justification,
      createdAt: new Date().toLocaleString(),
    };
    setSaved(data);
    setSent(true);
  }

  

  const canSubmit = projectLinked.trim() !== "" && passengerName.trim() !== "" && passengerEmail.trim() !== "" && passengerRG.trim() !== "" && passengerCPF.trim() !== "" && passengerDOB.trim() !== "" && passengerPhone.trim() !== "" && paymentConfirmation === true && localPartida.trim() !== "" && localChegada.trim() !== "" && missionStart.trim() !== "" && missionEnd.trim() !== "" && expenseType.trim() !== "" && requestKind.trim() !== "" && includeDesloc !== null;

  return (
    <div className="p-6 md:p-10 w-full max-w-5xl mx-auto">
      <Link to="/central-solicitacoes" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground/80 -mt-2 mb-6">
        <ChevronLeft className="size-3" /> Voltar para central de solicitações
      </Link>

      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-primary font-semibold">central de solicitações</div>
        <h1 className="text-3xl font-bold tracking-tight mt-1">Passagens e Diárias</h1>
        <div className="text-sm text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <span>Coordenação: Renata Braga</span>
          <span>Vigência: 01/06/2024 — 31/05/2026</span>
        </div>
      </div>
      <div className="w-full max-w-full">
        <div className="border-b mb-6 flex gap-1">
          <TabButton active={tab === "nova"} onClick={() => setTab("nova")} icon={<Plus className="size-4" />}>
            Nova Solicitação
          </TabButton>
          <TabButton active={tab === "historico"} onClick={() => setTab("historico")} icon={<History className="size-4" />}>
            Histórico {submissions.length > 0 && <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">{submissions.length}</span>}
          </TabButton>
        </div>

        {tab === "nova" ? (
          <div className="space-y-6">
            {sent && saved ? (
              <div className="rounded-2xl border bg-card p-10 text-center">
                <div className="size-14 rounded-full bg-[color:color-mix(in_oklab,var(--status-approved)_25%,transparent)] flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-7 text-[color:var(--status-approved-fg)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl font-semibold">Solicitação enviada com sucesso!</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">Sua solicitação de passagens e diárias foi registrada.</p>
                <button
                  onClick={() => {
                    setSubmissions((s) => [saved, ...s]);
                    setTab("historico");
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90"
                >
                  Ver no Histórico
                </button>
              </div>
            ) : (
              <>
                <div className="rounded-xl bg-primary-soft text-foreground border border-primary/20 p-4 mb-6 flex items-start gap-3">
                  <Info className="size-5 text-primary mt-0.5 shrink-0" />
                  <div className="text-sm">Quando você enviar este formulário, ele não coletará automaticamente seus detalhes, como nome e endereço de email, a menos que você mesmo o forneça.</div>
                </div>

                <section className="rounded-xl border bg-white p-6 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 text-base font-semibold mb-6 text-foreground leading-tight"><User2 className="size-4 text-primary" /> <span>Identificação e destino</span></div>
                  <div className="grid gap-3">
                    <label className="mb-3">
                      <div className="text-sm font-medium">Projeto Vinculado <span className="text-red-500 ml-1">*</span></div>
                      <select value={projectLinked} onChange={(e) => setProjectLinked(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground select-arrow" required>
                        <option>GESTÃO CEIA: CONTA FUNDO LOCAL</option>
                        {PROJECTS.map((p: any) => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </label>
                    <div className="border-t mt-4 mb-4" />
                    <div className="mb-3">
                      <TalentSearch onPick={(t: Talent) => {
                        setPassengerName(t.name || "");
                        setPassengerEmail(t.email || "");
                        setPassengerRG(t.rg || "");
                        setPassengerCPF(t.cpf || "");
                        if (t.dob) setPassengerDOB(t.dob);
                        if (t.phone) setPassengerPhone(t.phone);
                      }} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="mb-3">
                        <div className="text-sm font-medium">Nome do passageiro <span className="text-red-500 ml-1">*</span></div>
                        <input value={passengerName} onChange={(e) => setPassengerName(e.target.value)} placeholder="Nome completo" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" required />
                      </label>
                      <label className="mb-3">
                        <div className="text-sm font-medium">E-mail do passageiro <span className="text-red-500 ml-1">*</span></div>
                        <input value={passengerEmail} onChange={(e) => setPassengerEmail(e.target.value)} placeholder="email@exemplo.com" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" required />
                      </label>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <label className="mb-3">
                        <div className="text-sm font-medium">RG do passageiro <span className="text-red-500 ml-1">*</span></div>
                        <input value={passengerRG} onChange={(e) => setPassengerRG(e.target.value)} placeholder="RG" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" required />
                      </label>
                      <label className="mb-3">
                        <div className="text-sm font-medium">CPF do passageiro <span className="text-red-500 ml-1">*</span></div>
                        <input value={passengerCPF} onChange={(e) => setPassengerCPF(e.target.value)} placeholder="000.000.000-00" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" required />
                      </label>
                      <label className="mb-3">
                        <div className="text-sm font-medium">Data de nascimento do passageiro <span className="text-red-500 ml-1">*</span></div>
                        <div className="relative mt-2">
                          <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input value={passengerDOB} onChange={(e) => setPassengerDOB(formatDateDDMMYYYY(e.target.value))} placeholder="DD/MM/AAAA" inputMode="numeric" maxLength={10} className="w-full rounded-lg border pl-10 pr-3 py-2 bg-white text-foreground" required />
                        </div>
                      </label>
                    </div>

                    <div className="grid gap-4">
                      <label className="mb-3">
                        <div className="text-sm font-medium">Telefone de contato <span className="text-red-500 ml-1">*</span></div>
                        <input value={passengerPhone} onChange={(e) => setPassengerPhone(e.target.value)} placeholder="Telefone" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" required />
                      </label>

                      <div className="border-t mt-3 mb-3" />

                      <label className="mb-3">
                        <div className="text-sm font-medium">Confirmação de Pagamento <span className="text-red-500 ml-1">*</span></div>
                        <div className="mt-2 text-sm">
                          <label className="inline-flex items-baseline gap-2"><input className="mt-2" type="checkbox" checked={paymentConfirmation} onChange={(e) => setPaymentConfirmation(e.target.checked)} required /> <span>Declaro estar ciente de que o pagamento será realizado exclusivamente via transferência PIX, utilizando como chave o CPF informado nesta solicitação.</span></label>
                        </div>
                      </label>
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border bg-white p-6 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 text-base font-semibold mb-6 text-foreground leading-tight"><MapPin className="size-4 text-primary" /> <span>Definição da missão e do destino</span></div>
                  <div className="grid gap-3">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="mb-3">
                        <div className="text-sm font-medium">Local de partida <span className="text-red-500 ml-1">*</span></div>
                        <input value={localPartida} onChange={(e) => setLocalPartida(e.target.value)} placeholder="Informe o local onde iniciará a viagem" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" required />
                      </label>
                      <label className="mb-3">
                        <div className="text-sm font-medium">Local de chegada <span className="text-red-500 ml-1">*</span></div>
                        <input value={localChegada} onChange={(e) => setLocalChegada(e.target.value)} placeholder="Informe o local onde será concluída a viagem" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" required />
                      </label>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="mb-3">
                        <div className="text-sm font-medium">Data de início da missão/evento <span className="text-red-500 ml-1">*</span></div>
                        <div className="relative mt-2">
                          <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input value={missionStart} onChange={(e) => setMissionStart(formatDateDDMMYYYY(e.target.value))} placeholder="DD/MM/AAAA" inputMode="numeric" maxLength={10} className="w-full rounded-lg border pl-10 pr-3 py-2 bg-white text-foreground" required />
                        </div>
                      </label>
                      <label className="mb-3">
                        <div className="text-sm font-medium">Data de término da missão/evento <span className="text-red-500 ml-1">*</span></div>
                        <div className="relative mt-2">
                          <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input value={missionEnd} onChange={(e) => setMissionEnd(formatDateDDMMYYYY(e.target.value))} placeholder="DD/MM/AAAA" inputMode="numeric" maxLength={10} className="w-full rounded-lg border pl-10 pr-3 py-2 bg-white text-foreground" required />
                        </div>
                      </label>
                    </div>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Tipo de despesa <span className="text-red-500 ml-1">*</span></div>
                      <select value={expenseType} onChange={(e) => setExpenseType(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground select-arrow" required>
                        <option value="">Selecione</option>
                        <option value="pessoal_pdi">Pessoal da equipe de PD&I</option>
                        <option value="unidade_embrapii">Pessoal da Unidade EMBRAPII-CEIA</option>
                        <option value="outra">Outra</option>
                      </select>
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Selecione o tipo da sua solicitação <span className="text-red-500 ml-1">*</span></div>
                      <select value={requestKind} onChange={(e) => setRequestKind(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground select-arrow" required>
                        <option value="passagens_e_diarias">Passagens e Diárias</option>
                        <option value="apenas_passagens">Apenas Passagens</option>
                        <option value="apenas_diarias">Apenas Diárias</option>
                      </select>
                    </label>
                  </div>
                </section>

                <section className="rounded-xl border bg-white p-6 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 text-base font-semibold mb-6 text-foreground leading-tight"><Clock className="size-4 text-primary" /> <span>Diárias</span></div>
                  <div className="grid gap-3">
                    <label className="mb-3">
                      <div className="text-sm font-medium">Estime a quantidade de diárias</div>
                      <input value={diariaCount} onChange={(e) => setDiariaCount(e.target.value)} placeholder="Quantidade de diárias" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                      <div className="text-xs text-muted-foreground mt-1">A quantidade será calculada com base no início/fim acrescido do deslocamento; valor definitivo calculado pelo sistema.</div>
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Incluir adicional de deslocamento? <span className="text-red-500 ml-1">*</span></div>
                      <div className="mt-2 inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="desloc" checked={includeDesloc === true} onChange={() => setIncludeDesloc(true)} /> Sim</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="desloc" checked={includeDesloc === false} onChange={() => setIncludeDesloc(false)} /> Não</label>
                      </div>
                    </label>
                  </div>
                </section>

                <section className="rounded-xl border bg-white p-6 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 text-base font-semibold mb-6 text-foreground leading-tight"><Plane className="size-4 text-primary" /> <span>Passagens e voos</span></div>
                  <div className="grid gap-3">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="mb-3">
                        <div className="text-sm font-medium">Data de Ida</div>
                        <div className="relative mt-2">
                          <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input value={idaDate} onChange={(e) => setIdaDate(formatDateDDMMYYYY(e.target.value))} placeholder="DD/MM/AAAA" inputMode="numeric" maxLength={10} className="w-full rounded-lg border pl-10 pr-3 py-2 bg-white text-foreground" />
                        </div>
                      </label>
                      <label className="mb-3">
                        <div className="text-sm font-medium">Data de Volta</div>
                        <div className="relative mt-2">
                          <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input value={voltaDate} onChange={(e) => setVoltaDate(formatDateDDMMYYYY(e.target.value))} placeholder="DD/MM/AAAA" inputMode="numeric" maxLength={10} className="w-full rounded-lg border pl-10 pr-3 py-2 bg-white text-foreground" />
                        </div>
                      </label>
                    </div>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Sua viagem é internacional?</div>
                      <div className="mt-2 inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="intl" checked={international === true} onChange={() => setInternational(true)} /> Sim</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="intl" checked={international === false} onChange={() => setInternational(false)} /> Não</label>
                      </div>
                    </label>

                    {international === true && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <div className="text-sm font-medium">Irá precisar de seguro viagem?</div>
                          <div className="mt-2 inline-flex items-center gap-4">
                            <label className="inline-flex items-center gap-2"><input type="radio" name="seguro" checked={travelInsurance === true} onChange={() => setTravelInsurance(true)} /> Sim</label>
                            <label className="inline-flex items-center gap-2"><input type="radio" name="seguro" checked={travelInsurance === false} onChange={() => setTravelInsurance(false)} /> Não</label>
                          </div>
                        </div>

                        {travelInsurance === true && (
                          <div className="space-y-3">
                            <label className="mb-3 pt-4">
                              <div className="text-sm font-medium">Informe o nome do seu contato de emergência:</div>
                              <div className="text-xs text-muted-foreground">Caso não precise de seguro viagem, digite: NÃO SE APLICA</div>
                              <input value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} placeholder="Insira sua resposta" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                            </label>

                            <label className="mb-3">
                              <div className="text-sm font-medium">Informe o número do seu contato de emergência:</div>
                              <div className="text-xs text-muted-foreground">Caso não precise de seguro viagem, digite: NÃO SE APLICA</div>
                              <input value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} placeholder="Insira sua resposta" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                            </label>

                            <label className="mb-3">
                              <div className="text-sm font-medium">Informe o endereço com CEP do seu contato de emergência:</div>
                              <div className="text-xs text-muted-foreground">Caso não precise de seguro viagem, digite: NÃO SE APLICA</div>
                              <input value={emergencyContactAddress} onChange={(e) => setEmergencyContactAddress(e.target.value)} placeholder="Insira sua resposta" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                            </label>

                            <label className="mb-3">
                              <div className="text-sm font-medium">Número do passaporte:</div>
                              <input value={passportNumberIntl} onChange={(e) => setPassportNumberIntl(e.target.value)} placeholder="Insira sua resposta" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                            </label>

                            <label className="mb-3">
                              <div className="text-sm font-medium">Envio da imagem do passaporte</div>
                              <details className="mt-2">
                                <summary className="cursor-pointer text-sm text-primary underline">Instruções de envio do passaporte</summary>
                                <div className="mt-2 text-sm text-muted-foreground">Clique no link abaixo para enviar a imagem do passaporte do passageiro:<br /><a className="text-primary underline" href="https://ceiaufg.sharepoint.com/:f:/s/CentraldeSolicitacoes/ErsXaua7A-FJvcY3oSVd5P8B1NNfzeMuknO2KtZHf6USHg" target="_blank" rel="noreferrer">Envio Passaporte</a></div>
                                <div className="text-xs text-muted-foreground mt-2">1- O arquivo deve ser nomeado como: Passaporte<br/>2- Ao acessar o link, preencha seus dados (nome e sobrenome) conforme solicitado<br/>Essas informações são usadas para identificar corretamente o autor do envio.</div>
                                <label className="inline-flex items-start gap-2 mt-2"><input type="checkbox" checked={passportUploadedConfirm} onChange={(e) => setPassportUploadedConfirm(e.target.checked)} /> <span className="text-sm">Confirmo que realizei o upload da imagem do passaporte com o nome correto (Passaporte) e que preenchi meu nome completo na tela de envio.</span></label>
                              </details>
                            </label>
                          </div>
                        )}

                        {travelInsurance === false && (
                          <div className="space-y-3">
                            <label className="mb-3 pt-4">
                              <div className="text-sm font-medium">Número do passaporte:</div>
                              <input value={passportNumberIntl} onChange={(e) => setPassportNumberIntl(e.target.value)} placeholder="Insira sua resposta" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                            </label>

                            <label className="mb-3">
                              <div className="text-sm font-medium">Envio da imagem do passaporte</div>
                              <details className="mt-2">
                                <summary className="cursor-pointer text-sm text-primary underline">Instruções de envio do passaporte</summary>
                                <div className="mt-2 text-sm text-muted-foreground">Clique no link abaixo para enviar a imagem do passaporte do passageiro:<br /><a className="text-primary underline" href="https://ceiaufg.sharepoint.com/:f:/s/CentraldeSolicitacoes/ErsXaua7A-FJvcY3oSVd5P8B1NNfzeMuknO2KtZHf6USHg" target="_blank" rel="noreferrer">Envio Passaporte</a></div>
                                <div className="text-xs text-muted-foreground mt-2">1- O arquivo deve ser nomeado como: Passaporte<br/>2- Ao acessar o link, preencha seus dados (nome e sobrenome) conforme solicitado<br/>Essas informações são usadas para identificar corretamente o autor do envio.</div>
                                <label className="inline-flex items-start gap-2 mt-2"><input type="checkbox" checked={passportUploadedConfirm} onChange={(e) => setPassportUploadedConfirm(e.target.checked)} /> <span className="text-sm">Confirmo que realizei o upload da imagem do passaporte com o nome correto (Passaporte) e que preenchi meu nome completo na tela de envio.</span></label>
                              </details>
                            </label>
                          </div>
                        )}

                        {travelInsurance !== null && (
                          <>
                                    {travelInsurance !== null && (
                                      <>
                                        <div className="pt-2 border-t" />
                                        <label className="mb-3 pt-4">
                                          <div className="text-sm font-medium">Tipo de Transporte:</div>
                                          <div className="text-xs text-muted-foreground">A passagem de transporte rodoviário é adquirida pelo passageiro e reembolsada posteriormente.</div>
                                          <select value={transportType} onChange={(e) => setTransportType(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground select-arrow">
                                            <option value="">Selecionar sua resposta</option>
                                            <option value="aereo">Aéreo</option>
                                            <option value="rodoviario">Rodoviário</option>
                                            <option value="carro_proprio">Carro próprio</option>
                                          </select>
                                        </label>

                                        <label className="mb-3">
                                          <div className="text-sm font-medium">Incluir franquia de bagagem?</div>
                                          <div className="mt-2 text-xs text-muted-foreground">Após a compra da passagem não é mais possível incluir bagagens pagas com recurso do projeto, apenas com recurso próprio do passageiro.</div>
                                          <div className="mt-2 inline-flex items-center gap-4">
                                            <label className="inline-flex items-center gap-2"><input type="radio" name="bagagem" checked={includeBaggage} onChange={() => setIncludeBaggage(true)} /> Sim</label>
                                            <label className="inline-flex items-center gap-2"><input type="radio" name="bagagem" checked={!includeBaggage} onChange={() => setIncludeBaggage(false)} /> Não</label>
                                          </div>
                                        </label>
                                      </>
                                    )}
                          </>
                        )}
                      </div>
                    )}

                    {international === false && (
                      <>
                        <label className="mb-3 pt-4">
                          <div className="text-sm font-medium">Tipo de Transporte:</div>
                          <div className="text-xs text-muted-foreground">A passagem de transporte rodoviário é adquirida pelo passageiro e reembolsada posteriormente.</div>
                          <select value={transportType} onChange={(e) => setTransportType(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground select-arrow">
                            <option value="">Selecionar sua resposta</option>
                            <option value="aereo">Aéreo</option>
                            <option value="rodoviario">Rodoviário</option>
                            <option value="carro_proprio">Carro próprio</option>
                          </select>
                        </label>

                        <label>
                          <div className="text-sm font-medium">Incluir franquia de bagagem?</div>
                          <div className="mt-2 text-xs text-muted-foreground">Após a compra da passagem não é mais possível incluir bagagens pagas com recurso do projeto, apenas com recurso próprio do passageiro.</div>
                          <div className="mt-2 inline-flex items-center gap-4">
                            <label className="inline-flex items-center gap-2"><input type="radio" name="bagagem" checked={includeBaggage} onChange={() => setIncludeBaggage(true)} /> Sim</label>
                            <label className="inline-flex items-center gap-2"><input type="radio" name="bagagem" checked={includeBaggage === false} onChange={() => setIncludeBaggage(false)} /> Não</label>
                          </div>
                        </label>
                      </>
                    )}
                  </div>
                </section>

                <section className="rounded-xl border bg-white p-6 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 text-base font-semibold mb-6 text-foreground leading-tight"><Settings className="size-4 text-primary" /> <span>Restrições e preferências</span></div>
                  <div className="grid gap-3">
                    <label>
                      <div className="text-sm font-medium">Possui restrição de Voo?</div>
                      <div className="mt-2 inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="restricao" checked={flightRestriction === true} onChange={() => setFlightRestriction(true)} /> Sim</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="restricao" checked={flightRestriction === false} onChange={() => setFlightRestriction(false)} /> Não</label>
                      </div>
                    </label>

                    {flightRestriction === true && (
                      <>
                          <label className="mb-3">
                          <div className="text-sm font-medium">Informe os horários preferenciais</div>
                          <input value={preferredTimes} onChange={(e) => setPreferredTimes(e.target.value)} placeholder="Insira sua resposta" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                        </label>

                          <label className="mb-3">
                          <div className="text-sm font-medium">Possui preferência de voo?</div>
                          <div className="mt-2 inline-flex items-center gap-4">
                            <label className="inline-flex items-center gap-2"><input type="radio" name="pref" checked={flightPreference === true} onChange={() => setFlightPreference(true)} /> Sim</label>
                            <label className="inline-flex items-center gap-2"><input type="radio" name="pref" checked={flightPreference === false} onChange={() => setFlightPreference(false)} /> Não</label>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">Se tiver preferência, deverá adicionar sugestão de voos.</div>
                        </label>

                        {flightPreference === true && (
                          <label className="mb-3">
                            <div className="text-sm font-medium">Por favor, anexe o arquivo com a pesquisa, contendo: data, companhia aérea, horário e valor do voo.</div>
                            <details className="mt-2">
                              <summary className="cursor-pointer text-sm text-primary underline">Instruções para envio da sugestão de voo</summary>
                              <div className="mt-2 text-sm text-muted-foreground">Clique no link abaixo para enviar:<br /><a className="text-primary underline" href="https://ceiaufg.sharepoint.com/:f:/s/CentraldeSolicitacoes/EnIaDA1igR9Kg_Z4PhSJLocB3OhGjpVHWMdBE8VmibGNbQ" target="_blank" rel="noreferrer">Envio Sugestão</a></div>
                              <div className="text-xs text-muted-foreground mt-2">O arquivo deve ser nomeado como: Pesquisa.pdf<br/>Ao acessar o link, preencha seus dados (nome e sobrenome) conforme solicitado<br/> Essas informações são usadas para identificar corretamente o autor do envio.</div>
                              <label className="inline-flex items-start gap-2 mt-2"><input type="checkbox" checked={uploadedConfirm} onChange={(e) => setUploadedConfirm(e.target.checked)} /> <span className="text-sm">Confirmo que realizei o upload do arquivo com o nome correto (Pesquisa.pdf) e que preenchi meu nome completo na tela de envio.</span></label>
                            </details>
                          </label>
                        )}
                      </>
                    )}

                    {flightRestriction === false && (
                      <>
                        <label>
                          <div className="text-sm font-medium">Possui preferência de voo?</div>
                          <div className="mt-2 inline-flex items-center gap-4">
                            <label className="inline-flex items-center gap-2"><input type="radio" name="pref_no_restr" checked={flightPreference === true} onChange={() => setFlightPreference(true)} /> Sim</label>
                            <label className="inline-flex items-center gap-2"><input type="radio" name="pref_no_restr" checked={flightPreference === false} onChange={() => setFlightPreference(false)} /> Não</label>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">Se tiver preferência, deverá adicionar sugestão de voos.</div>
                        </label>

                        {flightPreference === true && (
                          <label>
                            <div className="text-sm font-medium">Por favor, anexe o arquivo com a pesquisa, contendo: data, companhia aérea, horário e valor do voo.</div>
                            <details className="mt-2">
                              <summary className="cursor-pointer text-sm text-primary underline">Instruções para envio da sugestão de voo</summary>
                              <div className="mt-2 text-sm text-muted-foreground">Clique no link abaixo para enviar:<br /><a className="text-primary underline" href="https://ceiaufg.sharepoint.com/:f:/s/CentraldeSolicitacoes/EnIaDA1igR9Kg_Z4PhSJLocB3OhGjpVHWMdBE8VmibGNbQ" target="_blank" rel="noreferrer">Envio Sugestão</a></div>
                              <div className="text-xs text-muted-foreground mt-2">O arquivo deve ser nomeado como: Pesquisa.pdf<br/>Ao acessar o link, preencha seus dados (nome e sobrenome) conforme solicitado<br/> Essas informações são usadas para identificar corretamente o autor do envio.</div>
                              <label className="inline-flex items-start gap-2 mt-2"><input type="checkbox" checked={uploadedConfirm} onChange={(e) => setUploadedConfirm(e.target.checked)} /> <span className="text-sm">Confirmo que realizei o upload do arquivo com o nome correto (Pesquisa.pdf) e que preenchi meu nome completo na tela de envio.</span></label>
                            </details>
                          </label>
                        )}
                      </>
                    )}
                  </div>
                </section>

                <section className="rounded-xl border bg-white p-6 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 text-base font-semibold mb-6 text-foreground leading-tight"><Briefcase className="size-4 text-primary" /> <span>Objetivo da viagem</span></div>
                  <div className="grid gap-3">
                    <label className="mb-3">
                      <div className="text-sm font-medium">Observação importante ou comentário</div>
                      <input value={observation} onChange={(e) => setObservation(e.target.value)} placeholder="Insira sua resposta" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>
                    <label className="mb-3">
                      <div className="text-sm font-medium">Descrição das atividades a serem executadas</div>
                      <textarea value={activitiesDesc} onChange={(e) => setActivitiesDesc(e.target.value)} placeholder="Insira sua resposta" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" rows={4} />
                    </label>
                    <label className="mb-3">
                      <div className="text-sm font-medium">Justificativa para solicitação com menos de 20 dias</div>
                      <input value={justification} onChange={(e) => setJustification(e.target.value)} placeholder='Caso não seja a sua situação, escreva "NÃO SE APLICA"' className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>
                  </div>
                </section>
              </>
            )}
          </div>
        ) : (
          <PassagensHistoryList submissions={submissions} />
        )}
      </div>

      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-10 md:bottom-6 md:max-w-xl md:ml-auto z-30">
        <div className="rounded-2xl border bg-white/95 backdrop-blur shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div />
          <div className="flex items-center gap-2">
            <button onClick={clear} className="rounded-lg border px-4 py-2">Limpar</button>
            <button onClick={submit} disabled={!canSubmit} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
              <Send className="size-4" /> Enviar solicitação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PassagensDiariasPage;

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

function PassagensHistoryList({ submissions }: { submissions: any[] }) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
        Nenhuma solicitação anterior.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((s: any, idx: number) => (
        <div key={idx} className="rounded-xl border bg-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{s.passengerName || 'Passageiro'}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">Projeto: {s.projectLinked} • Enviado em {s.createdAt}</div>
            <div className="text-sm mt-2">Destino: {s.localChegada} • {s.missionStart} — {s.missionEnd}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent">Ver detalhes</button>
          </div>
        </div>
      ))}
    </div>
  );
}
