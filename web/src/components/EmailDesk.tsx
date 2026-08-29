import { useState } from "react"
import { motion } from "motion/react"
import { formatGaps } from "../lib/schedule"
import type { Company, MailDraft } from "../types"

type Props = {
  companies: Company[]
  drafts: Record<string, MailDraft>
  gaps: number[]
  sendNote?: string
  onBack: () => void
  onReset: () => void
  onDashboard: () => void
  onEditOne: (id: string, instruction: string) => void
  onEditAll: (instruction: string) => void
  onChangeDraft: (id: string, patch: Partial<MailDraft>) => void
  onSendOne: (id: string) => void
  onSendAll: () => void
  onSchedule: (text: string) => void
}

export function EmailDesk({
  companies,
  drafts,
  gaps,
  sendNote,
  onBack,
  onReset,
  onDashboard,
  onEditOne,
  onEditAll,
  onChangeDraft,
  onSendOne,
  onSendAll,
  onSchedule,
}: Props) {
  const [global, setGlobal] = useState("")
  const [plan, setPlan] = useState("")
  const rows = companies.filter((c) => drafts[c.id])
  const sent = rows.filter((c) => drafts[c.id].status === "enviado").length

  return (
    <div className="relative z-10 mx-auto flex min-h-svh max-w-4xl flex-col px-5 py-8 text-white">
      <header className="flex items-center justify-between text-white/70">
        <div className="flex items-center gap-4">
          <button type="button" onClick={onBack} className="text-xs hover:text-white">
            Atrás
          </button>
          <p className="text-[11px] tracking-[0.28em] uppercase">Emails del lote</p>
        </div>
        <div className="flex gap-4 text-xs">
          <button type="button" onClick={onDashboard} className="hover:text-white">
            Después del envío
          </button>
          <button type="button" onClick={onReset} className="hover:text-white">
            Inicio
          </button>
        </div>
      </header>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display mt-8 text-4xl font-extrabold tracking-tight uppercase"
      >
        Borradores
      </motion.h1>
      <p className="mt-2 text-sm text-white/60">
        {rows.length} emails · {sent} enviados
        {gaps.length ? ` · intervalos ${formatGaps(gaps)}` : ""}
      </p>
      {sendNote ? <p className="mt-1 text-sm text-[#C8D0BC]">{sendNote}</p> : null}

      <form
        className="mirror-deep mt-6 flex flex-col gap-2 rounded-[24px] px-4 py-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          if (!global.trim()) return
          onEditAll(global.trim())
          setGlobal("")
        }}
      >
        <label className="flex-1 text-left text-[11px] tracking-wide text-white/45 uppercase">
          Editar todos
          <input
            value={global}
            onChange={(event) => setGlobal(event.target.value)}
            placeholder="más cortos, tuteo, mismo cierre…"
            className="mt-1 w-full bg-transparent text-[14px] text-white outline-none placeholder:text-white/35"
          />
        </label>
        <button type="submit" className="pill-ghost rounded-full px-4 py-2 text-xs">
          Aplicar a todos
        </button>
      </form>

      <form
        className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center"
        onSubmit={(event) => {
          event.preventDefault()
          if (!plan.trim()) return
          onSchedule(plan.trim())
          setPlan("")
        }}
      >
        <input
          value={plan}
          onChange={(event) => setPlan(event.target.value)}
          placeholder="Órdenes de envío: 45, 23, 125 o “estos ahora, el resto mañana”"
          className="mirror flex-1 rounded-full px-4 py-2.5 text-[13px] text-white outline-none placeholder:text-white/35"
        />
        <button type="submit" className="pill-ghost rounded-full px-4 py-2 text-xs">
          Armar plan
        </button>
        <button type="button" onClick={onSendAll} className="pill-solid rounded-full px-5 py-2 text-sm font-semibold">
          Enviar todos
        </button>
      </form>

      <div className="mt-6 space-y-4 pb-10">
        {rows.map((company) => (
          <MailRow
            key={company.id}
            company={company}
            draft={drafts[company.id]}
            onChange={onChangeDraft}
            onEdit={onEditOne}
            onSend={onSendOne}
          />
        ))}
      </div>
    </div>
  )
}

function MailRow({
  company,
  draft,
  onChange,
  onEdit,
  onSend,
}: {
  company: Company
  draft: MailDraft
  onChange: (id: string, patch: Partial<MailDraft>) => void
  onEdit: (id: string, instruction: string) => void
  onSend: (id: string) => void
}) {
  const [note, setNote] = useState("")
  const sent = draft.status === "enviado"

  return (
    <article className="lead-card rounded-[22px] px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-display text-[18px] font-bold tracking-tight text-[#F4F4EE] uppercase">
            {company.empresa}
          </p>
          <p className="text-xs text-[#A8B499]">{company.contacto} · {company.email}</p>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] tracking-wide text-white/80 uppercase">
          {draft.status}
        </span>
      </div>
      <input
        value={draft.asunto}
        disabled={sent}
        onChange={(event) => onChange(company.id, { asunto: event.target.value })}
        className="mt-3 w-full bg-transparent text-[15px] font-medium text-white outline-none"
      />
      <textarea
        value={draft.cuerpo}
        disabled={sent}
        onChange={(event) => onChange(company.id, { cuerpo: event.target.value })}
        rows={4}
        className="mt-2 w-full resize-y bg-transparent text-[14px] leading-relaxed text-white/80 outline-none"
      />
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={note}
          disabled={sent}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Mini-chat: más corto, tuteo, no menciones el blog…"
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[13px] outline-none placeholder:text-white/35"
        />
        <button
          type="button"
          disabled={sent || !note.trim()}
          onClick={() => {
            onEdit(company.id, note.trim())
            setNote("")
          }}
          className="pill-ghost rounded-full px-3 py-1.5 text-xs disabled:opacity-40"
        >
          Reescribir
        </button>
        <button
          type="button"
          disabled={sent}
          onClick={() => onSend(company.id)}
          className="pill-solid rounded-full px-4 py-1.5 text-xs font-semibold disabled:opacity-40"
        >
          Enviar
        </button>
      </div>
    </article>
  )
}
