import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Plus, History, ChevronLeft, Calendar, Info } from "lucide-react";
import { PROJECTS } from "@/lib/ptr-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/central-solicitacoes/compras-pagamentos")({
  head: () => ({
    meta: [
      { title: "Compras & Pagamentos — Portal CEIA" },
      { name: "description", content: "Solicite compras e pagamentos diretamente." },
    ],
  }),
  component: ComprasPagamentosPage,
});

function formatDateDDMMYYYY(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
}

function ComprasPagamentosPage() {
  const [requestingForOther, setRequestingForOther] = useState<boolean | null>(null);
  const [otherName, setOtherName] = useState("");
  const [otherEmail, setOtherEmail] = useState("");
  const [otherDOB, setOtherDOB] = useState("");
  const [otherPhone, setOtherPhone] = useState("");
  const [projectLinked, setProjectLinked] = useState("");
  const [requestType, setRequestType] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [usageDescription, setUsageDescription] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [neededDate, setNeededDate] = useState("");
  const [over800, setOver800] = useState<boolean | null>(null);
  const [amount, setAmount] = useState("");
  const [hasAttachments, setHasAttachments] = useState<boolean | null>(null);
  const [attachmentsConfirm, setAttachmentsConfirm] = useState(false);
  const [cpf, setCpf] = useState("");
  const [contactEventEmail, setContactEventEmail] = useState("");
  const [eventName, setEventName] = useState("");
  const [activityDesc, setActivityDesc] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [registrationDone, setRegistrationDone] = useState<boolean | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyCNPJ, setCompanyCNPJ] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [otherDescription, setOtherDescription] = useState("");
  const [cpfSolicitante, setCpfSolicitante] = useState("");
  const [rgSolicitante, setRgSolicitante] = useState("");
  const [paymentConfirmation, setPaymentConfirmation] = useState("");
  const [enderecoSolicitante, setEnderecoSolicitante] = useState("");
  const [cepSolicitante, setCepSolicitante] = useState("");
  const [cargoProjeto, setCargoProjeto] = useState("");
  const [purchasesList, setPurchasesList] = useState("");
  const [justification, setJustification] = useState("");

  const [tab, setTab] = useState<"nova" | "historico">("nova");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [saved, setSaved] = useState<any | null>(null);
  const [sent, setSent] = useState(false);

  function clear() {
    setRequestingForOther(null);
    setOtherName("");
    setOtherEmail("");
    setOtherDOB("");
    setOtherPhone("");
    setProjectLinked("");
    setRequestType("");
    setSent(false);
    setSaved(null);
    setItemDescription("");
    setUsageDescription("");
    setDeliveryLocation("");
    setNeededDate("");
    setOver800(null);
    setAmount("");
    setHasAttachments(null);
    setAttachmentsConfirm(false);
    setCpf("");
    setContactEventEmail("");
    setEventName("");
    setActivityDesc("");
    setEventLocation("");
    setRegistrationDeadline("");
    setRegistrationDone(null);
    setCompanyName("");
    setCompanyCNPJ("");
    setBankDetails("");
    setCompanyAddress("");
    setCompanyPhone("");
    setServiceDescription("");
    setOtherDescription("");
    setCpfSolicitante("");
    setRgSolicitante("");
    setPaymentConfirmation("");
    setEnderecoSolicitante("");
    setCepSolicitante("");
    setCargoProjeto("");
    setPurchasesList("");
    setJustification("");
  }

  function submit() {
    const data = {
      requestingForOther,
      otherName,
      otherEmail,
      otherDOB,
      otherPhone,
      projectLinked,
      requestType,
      itemDescription,
      usageDescription,
      deliveryLocation,
      neededDate,
      over800,
      amount,
      hasAttachments,
      attachmentsConfirm,
      cpf,
      contactEventEmail,
      eventName,
      activityDesc,
      eventLocation,
      registrationDeadline,
      registrationDone,
      companyName,
      companyCNPJ,
      bankDetails,
      companyAddress,
      companyPhone,
      serviceDescription,
      cpfSolicitante,
      rgSolicitante,
      paymentConfirmation,
      enderecoSolicitante,
      cepSolicitante,
      cargoProjeto,
      purchasesList,
      justification,
      otherDescription,
      createdAt: new Date().toLocaleString(),
    };
    setSaved(data);
    setSent(true);
  }

  const canSubmit = projectLinked.trim() !== "" && requestType.trim() !== "";

  return (
    <div className="p-6 md:p-10 w-full max-w-full mx-auto">
      <Link to="/central-solicitacoes" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground/80 -mt-2 mb-6">
        <ChevronLeft className="size-3" /> Voltar para central de solicitações
      </Link>

      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-primary font-semibold">central de solicitações</div>
        <h1 className="text-3xl font-bold tracking-tight mt-1">Compras & Pagamentos</h1>
        <div className="text-sm text-muted-foreground mt-2">Abra o formulário abaixo para solicitar compras ou pagamentos.</div>
      </div>

      <div className="border-b mb-6 flex gap-1">
        <TabButton active={tab === "nova"} onClick={() => setTab("nova")} icon={<Plus className="size-4" />}>Nova Solicitação</TabButton>
        <TabButton active={tab === "historico"} onClick={() => setTab("historico")} icon={<History className="size-4" />}>Histórico {submissions.length > 0 && <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">{submissions.length}</span>}</TabButton>
      </div>

      {tab === "nova" ? (
        <div className="space-y-6">
          {sent && saved ? (
            <div className="rounded-2xl border bg-card p-10 text-center">
              <div className="size-14 rounded-full bg-[color:color-mix(in_oklab,var(--status-approved)_25%,transparent)] flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-7 text-[color:var(--status-approved-fg)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="text-xl font-semibold">Solicitação enviada com sucesso!</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">Sua solicitação de Compras & Pagamentos foi registrada.</p>
              <button onClick={() => { setSubmissions((s) => [saved, ...s]); setTab("historico"); }} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90">Ver no Histórico</button>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-primary-soft text-foreground border border-primary/20 p-4 mb-2 flex items-start gap-3">
                <Info className="size-5 text-primary mt-0.5 shrink-0" />
                <div className="text-sm">Preencha os dados da pessoa para a qual está solicitando, caso esteja solicitando em nome de outra pessoa.</div>
              </div>

              <section className="rounded-xl border bg-card p-6 mb-6">
                <div className="text-sm font-semibold mb-2">Seção 1: Identificação</div>
                <div className="grid gap-3">
                  <label className="mb-3">
                    <div className="text-sm font-medium">Está solicitando para outra pessoa?</div>
                    <div className="mt-2 inline-flex items-center gap-4">
                      <label className="inline-flex items-center gap-2"><input type="radio" name="outra" checked={requestingForOther === true} onChange={() => setRequestingForOther(true)} /> Sim</label>
                      <label className="inline-flex items-center gap-2"><input type="radio" name="outra" checked={requestingForOther === false} onChange={() => setRequestingForOther(false)} /> Não</label>
                    </div>
                  </label>

                  {requestingForOther === true && (
                    <>
                      <label className="mb-3">
                        <div className="text-sm font-medium">Nome completo da pessoa para a qual está solicitando</div>
                        <input value={otherName} onChange={(e) => setOtherName(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                      </label>

                      <label className="mb-3">
                        <div className="text-sm font-medium">E-mail da pessoa para qual está solicitando</div>
                        <input value={otherEmail} onChange={(e) => setOtherEmail(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                      </label>

                      <label className="mb-3">
                        <div className="text-sm font-medium">Data de nascimento</div>
                        <div className="relative mt-2">
                          <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input value={otherDOB} onChange={(e) => setOtherDOB(formatDateDDMMYYYY(e.target.value))} placeholder="DD/MM/AAAA" inputMode="numeric" maxLength={10} className="w-full rounded-lg border pl-10 pr-3 py-2 bg-white text-foreground" />
                        </div>
                      </label>

                      <label className="mb-3">
                        <div className="text-sm font-medium">Número de telefone</div>
                        <input value={otherPhone} onChange={(e) => setOtherPhone(e.target.value)} placeholder="Inserir um número" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                      </label>
                    </>
                  )}
                  {requestingForOther === false && (
                    <>
                      <label className="mb-3">
                        <div className="text-sm font-medium">Data de nascimento</div>
                        <div className="relative mt-2">
                          <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input value={otherDOB} onChange={(e) => setOtherDOB(formatDateDDMMYYYY(e.target.value))} placeholder="DD/MM/AAAA" inputMode="numeric" maxLength={10} className="w-full rounded-lg border pl-10 pr-3 py-2 bg-white text-foreground" />
                        </div>
                      </label>

                      <label className="mb-3">
                        <div className="text-sm font-medium">Número de telefone</div>
                        <input value={otherPhone} onChange={(e) => setOtherPhone(e.target.value)} placeholder="Inserir um número" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                      </label>

                      <label className="mb-3">
                        <div className="text-sm font-medium">Nome do projeto que custeará a despesa</div>
                        <select value={projectLinked} onChange={(e) => setProjectLinked(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground select-arrow">
                          <option value="">Selecionar uma opção</option>
                          {PROJECTS.map((p: any) => (<option key={p.id} value={p.name}>{p.name}</option>))}
                        </select>
                      </label>

                      <label className="mb-3">
                        <div className="text-sm font-medium">Qual o tipo de solicitação?</div>
                        <select value={requestType} onChange={(e) => setRequestType(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground select-arrow">
                        <option value="">—</option>
                        <option value="compra_material_servico">Compra de material/serviço</option>
                        <option value="pagamento_material_servico">Pagamento de material/serviço</option>
                        <option value="inscricao_publicacao">Inscrição/publicação</option>
                        <option value="ressarcimento_despesa">Ressarcimento de despesa</option>
                        <option value="outros">Outros</option>
                      </select>
                      </label>
                    </>
                  )}
                </div>
              </section>

              {requestingForOther !== false && (
                <section className="rounded-xl border bg-card p-6 mb-6">
                  <div className="text-sm font-semibold mb-2">Seção 2: Projeto e Tipo</div>
                  <div className="grid gap-3">
                    <label className="mb-3">
                      <div className="text-sm font-medium">Nome do projeto que custeará a despesa</div>
                      <select value={projectLinked} onChange={(e) => setProjectLinked(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground select-arrow">
                        <option value="">Selecionar uma opção</option>
                        {PROJECTS.map((p: any) => (<option key={p.id} value={p.name}>{p.name}</option>))}
                      </select>
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Qual o tipo de solicitação?</div>
                        <select value={requestType} onChange={(e) => setRequestType(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground select-arrow">
                          <option value="">—</option>
                          <option value="compra_material_servico">Compra de material/serviço</option>
                          <option value="pagamento_material_servico">Pagamento de material/serviço</option>
                          <option value="inscricao_publicacao">Inscrição/publicação</option>
                          <option value="ressarcimento_despesa">Ressarcimento de despesa</option>
                          <option value="outros">Outros</option>
                        </select>
                    </label>
                  </div>
                </section>
              )}

              {/* Campos para Inscrição / Publicação */}
              {requestType === "inscricao_publicacao" && (
                <section className="rounded-xl border bg-card p-6 mb-6">
                  <div className="text-sm font-semibold mb-2">Inscrição / Publicação</div>
                  <div className="grid gap-3">
                    <label className="mb-3">
                      <div className="text-sm font-medium">CPF</div>
                      <input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">E-mail de contato do evento</div>
                      <input value={contactEventEmail} onChange={(e) => setContactEventEmail(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Nome do evento, curso ou periódico para publicação em que deseja realizar a inscrição</div>
                      <input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Qual atividade será realizada?</div>
                      <input value={activityDesc} onChange={(e) => setActivityDesc(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Local onde acontecerá</div>
                      <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Data limite para a inscrição</div>
                      <div className="relative mt-2">
                        <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input value={registrationDeadline} onChange={(e) => setRegistrationDeadline(formatDateDDMMYYYY(e.target.value))} placeholder="DD/MM/AAAA" inputMode="numeric" maxLength={10} className="w-full rounded-lg border pl-10 pr-3 py-2 bg-white text-foreground" />
                      </div>
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">A inscrição já foi feita?</div>
                      <div className="mt-2 inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="regdone" checked={registrationDone === true} onChange={() => setRegistrationDone(true)} /> Sim</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="regdone" checked={registrationDone === false} onChange={() => setRegistrationDone(false)} /> Não</label>
                      </div>
                    </label>
                  </div>
                </section>
              )}

              {/* Campos para Ressarcimento de despesa */}
              {requestType === "ressarcimento_despesa" && (
                <section className="rounded-xl border bg-card p-6 mb-6">
                  <div className="text-sm font-semibold mb-2">Ressarcimento de despesa</div>
                  <div className="grid gap-3">
                    <label className="mb-3">
                      <div className="text-sm font-medium">CPF do solicitante</div>
                      <input value={cpfSolicitante} onChange={(e) => setCpfSolicitante(e.target.value)} placeholder="Inserir um número" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">RG</div>
                      <input value={rgSolicitante} onChange={(e) => setRgSolicitante(e.target.value)} placeholder="Inserir um número" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Confirmação de pagamento</div>
                      <input value={paymentConfirmation} onChange={(e) => setPaymentConfirmation(e.target.value)} placeholder="Insira detalhes da confirmação" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Endereço do solicitante</div>
                      <input value={enderecoSolicitante} onChange={(e) => setEnderecoSolicitante(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                      <div className="text-xs text-muted-foreground mt-2">Lembre-se de adicionar o CEP</div>
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">CEP</div>
                      <input value={cepSolicitante} onChange={(e) => setCepSolicitante(e.target.value)} placeholder="Insira o CEP" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Cargo no projeto</div>
                      <input value={cargoProjeto} onChange={(e) => setCargoProjeto(e.target.value)} placeholder="Pesquisador, coordenador, etc." className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Liste a(s) compra(s) que solicita reembolso</div>
                      <textarea value={purchasesList} onChange={(e) => setPurchasesList(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" rows={4} />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Justificativa das despesas</div>
                      <textarea value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" rows={4} />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">O valor do(a) pagamento/reembolso/compra é maior que R$800,00?</div>
                      <div className="mt-2 inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="over800ress" checked={over800 === true} onChange={() => setOver800(true)} /> Sim</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="over800ress" checked={over800 === false} onChange={() => setOver800(false)} /> Não</label>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Se o valor for superior a R$ 800,00, será necessário apresentar 3 orçamentos. Se a compra for menor que R$ 800,00 o pedido será enviado à equipe administrativa do CEIA.</div>
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Qual será o valor?</div>
                      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Possui documentos para anexar?</div>
                      <div className="mt-2 inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="hasAttachRess" checked={hasAttachments === true} onChange={() => setHasAttachments(true)} /> Sim</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="hasAttachRess" checked={hasAttachments === false} onChange={() => setHasAttachments(false)} /> Não</label>
                      </div>
                    </label>

                    {hasAttachments === true && (
                      <label className="mb-3">
                        <div className="text-sm font-medium">Envie os documentos (orçamentos, notas, comprovantes)</div>
                        <div className="mt-2 text-sm text-muted-foreground">Envie no link padrão da Central ou anexe conforme instruções internas.</div>
                        <label className="inline-flex items-start gap-2 mt-2"><input type="checkbox" checked={attachmentsConfirm} onChange={(e) => setAttachmentsConfirm(e.target.checked)} /> <span className="text-sm">Confirmo que realizei o upload dos documentos solicitados e que preenchi meu nome completo na tela de envio.</span></label>
                      </label>
                    )}
                  </div>
                </section>
              )}

              {/* Campos para Pagamento de material/serviço */}
              {requestType === "pagamento_material_servico" && (
                <section className="rounded-xl border bg-card p-6 mb-6">
                  <div className="text-sm font-semibold mb-2">Pagamento de material/serviço</div>
                  <div className="grid gap-3">
                    <label className="mb-3">
                      <div className="text-sm font-medium">Nome da empresa</div>
                      <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">CNPJ</div>
                      <input value={companyCNPJ} onChange={(e) => setCompanyCNPJ(e.target.value)} placeholder="Inserir um número" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Dados bancários da empresa</div>
                      <input value={bankDetails} onChange={(e) => setBankDetails(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Endereço da empresa</div>
                      <input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Telefone da empresa</div>
                      <input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="Inserir um número" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Descrição do material ou serviço contratado. Caso haja alguma observação importante, inclua também.</div>
                      <textarea value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" rows={4} />
                      <div className="text-xs text-muted-foreground mt-2">Liste um item abaixo do outro, como se fosse uma tabela. Na descrição, inclua o tipo de item, marca, configuração e outras informações importantes.</div>
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">O valor do(a) pagamento/reembolso/compra é maior que R$800,00?</div>
                      <div className="mt-2 inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="over800pay" checked={over800 === true} onChange={() => setOver800(true)} /> Sim</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="over800pay" checked={over800 === false} onChange={() => setOver800(false)} /> Não</label>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Se o valor for superior a R$ 800,00, será necessário apresentar 3 orçamentos. Se a compra for menor que R$ 800,00 o pedido será enviado à equipe administrativa do CEIA.</div>
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Qual será o valor?</div>
                      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Possui documentos para anexar?</div>
                      <div className="mt-2 inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="hasAttachPay" checked={hasAttachments === true} onChange={() => setHasAttachments(true)} /> Sim</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="hasAttachPay" checked={hasAttachments === false} onChange={() => setHasAttachments(false)} /> Não</label>
                      </div>
                    </label>

                    {hasAttachments === true && (
                      <label className="mb-3">
                        <div className="text-sm font-medium">Envie os documentos (orçamentos, notas, comprovantes)</div>
                        <div className="mt-2 text-sm text-muted-foreground">Envie no link padrão da Central ou anexe conforme instruções internas.</div>
                        <label className="inline-flex items-start gap-2 mt-2"><input type="checkbox" checked={attachmentsConfirm} onChange={(e) => setAttachmentsConfirm(e.target.checked)} /> <span className="text-sm">Confirmo que realizei o upload dos documentos solicitados e que preenchi meu nome completo na tela de envio.</span></label>
                      </label>
                    )}
                  </div>
                </section>
              )}

              {/* Campos para Outros */}
              {requestType === "outros" && (
                <section className="rounded-xl border bg-card p-6 mb-6">
                  <div className="text-sm font-semibold mb-2">Outros</div>
                  <div className="grid gap-3">
                    <label className="mb-3">
                      <div className="text-sm font-medium">Descrição detalhada da solicitação</div>
                      <textarea value={otherDescription} onChange={(e) => setOtherDescription(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" rows={4} />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">O valor do(a) pagamento/reembolso/compra é maior que R$800,00?</div>
                      <div className="mt-2 inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="over800out" checked={over800 === true} onChange={() => setOver800(true)} /> Sim</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="over800out" checked={over800 === false} onChange={() => setOver800(false)} /> Não</label>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Se o valor for superior a R$ 800,00, será necessário apresentar 3 orçamentos. Se a compra for menor que R$ 800,00 o pedido será enviado à equipe administrativa do CEIA.</div>
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Qual será o valor?</div>
                      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Possui documentos para anexar?</div>
                      <div className="mt-2 inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="hasAttachOut" checked={hasAttachments === true} onChange={() => setHasAttachments(true)} /> Sim</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="hasAttachOut" checked={hasAttachments === false} onChange={() => setHasAttachments(false)} /> Não</label>
                      </div>
                    </label>

                    {hasAttachments === true && (
                      <label className="mb-3">
                        <div className="text-sm font-medium">Envie os documentos (orçamentos, notas, comprovantes)</div>
                        <div className="mt-2 text-sm text-muted-foreground">Envie no link padrão da Central ou anexe conforme instruções internas.</div>
                        <label className="inline-flex items-start gap-2 mt-2"><input type="checkbox" checked={attachmentsConfirm} onChange={(e) => setAttachmentsConfirm(e.target.checked)} /> <span className="text-sm">Confirmo que realizei o upload dos documentos solicitados e que preenchi meu nome completo na tela de envio.</span></label>
                      </label>
                    )}
                  </div>
                </section>
              )}

              {/* Detalhamento específico para Compra de material/serviço */}
              {requestType === "compra_material_servico" && (
                <section className="rounded-xl border bg-card p-6 mb-6">
                  <div className="text-sm font-semibold mb-2">Detalhamento da Compra</div>
                  <div className="grid gap-3">
                    <label className="mb-3">
                      <div className="text-sm font-medium">Descreva o(s) item(ns), a(s) quantidade(s). Caso haja alguma observação importante, inclua também.</div>
                      <textarea value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" rows={4} />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Descreva também: local onde o produto ou serviço será utilizado; aderência da compra aos objetivos do projeto financiador da compra, importância de adquirir o produto ou serviço, e deixar explícito que a finalidade da compra é a utilização do bem ou serviço em atividades de pesquisa.</div>
                      <textarea value={usageDescription} onChange={(e) => setUsageDescription(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" rows={4} />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Local de entrega</div>
                      <input value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Data em que necessita do(s) material(is) ou serviço(s)</div>
                      <div className="relative mt-2">
                        <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input value={neededDate} onChange={(e) => setNeededDate(formatDateDDMMYYYY(e.target.value))} placeholder="DD/MM/AAAA" inputMode="numeric" maxLength={10} className="w-full rounded-lg border pl-10 pr-3 py-2 bg-white text-foreground" />
                      </div>
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">O valor do(a) pagamento/reembolso/compra é maior que R$800,00?</div>
                      <div className="mt-2 inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="over800" checked={over800 === true} onChange={() => setOver800(true)} /> Sim</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="over800" checked={over800 === false} onChange={() => setOver800(false)} /> Não</label>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Se o valor for superior a R$ 800,00, será necessário apresentar 3 orçamentos. Se a compra for menor que R$ 800,00 o pedido será enviado à equipe administrativa do CEIA.</div>
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Qual será o valor?</div>
                      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Insira o valor aqui" className="mt-2 w-full rounded-lg border px-3 py-2 bg-white text-foreground" />
                    </label>

                    <label className="mb-3">
                      <div className="text-sm font-medium">Possui documentos para anexar?</div>
                      <div className="mt-2 inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2"><input type="radio" name="hasAttach" checked={hasAttachments === true} onChange={() => setHasAttachments(true)} /> Sim</label>
                        <label className="inline-flex items-center gap-2"><input type="radio" name="hasAttach" checked={hasAttachments === false} onChange={() => setHasAttachments(false)} /> Não</label>
                      </div>
                    </label>

                    {hasAttachments === true && (
                      <label className="mb-3">
                        <div className="text-sm font-medium">Envie os documentos (orçamentos, notas, comprovantes)</div>
                        <div className="mt-2 text-sm text-muted-foreground">Envie no link padrão da Central ou anexe conforme instruções internas.</div>
                        <label className="inline-flex items-start gap-2 mt-2"><input type="checkbox" checked={attachmentsConfirm} onChange={(e) => setAttachmentsConfirm(e.target.checked)} /> <span className="text-sm">Confirmo que realizei o upload dos documentos solicitados e que preenchi meu nome completo na tela de envio.</span></label>
                      </label>
                    )}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      ) : (
        <div>
          {submissions.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">Nenhuma solicitação anterior.</div>
          ) : (
            <div className="space-y-3">{submissions.map((s, i) => (
              <div key={i} className="rounded-xl border bg-card p-5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{s.otherName || 'Solicitação'}</div>
                  <div className="text-sm text-muted-foreground">Projeto: {s.projectLinked} • {s.createdAt}</div>
                </div>
                <div />
              </div>
            ))}</div>
          )}
        </div>
      )}

      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-10 md:bottom-6 md:max-w-xl md:ml-auto z-30">
        <div className="rounded-2xl border bg-card/95 backdrop-blur shadow-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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

export default ComprasPagamentosPage;

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("flex-1 relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium -mb-px")}>
      <div className={cn("flex items-center gap-2", active ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
        {icon}
        <span className="truncate">{children}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <span style={{ display: "block", height: "100%", backgroundColor: "var(--primary)", transform: active ? "scaleX(1)" : "scaleX(0)", transformOrigin: "center", transition: "transform 360ms cubic-bezier(.2,.9,.2,1)", }} />
      </div>
    </button>
  );
}
