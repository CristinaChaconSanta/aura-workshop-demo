import { DRAFTS } from "../data/drafts"
import type { Company, MailDraft } from "../types"

export function seedDraft(company: Company): MailDraft {
  const base = DRAFTS[company.id]
  return {
    companyId: company.id,
    asunto: base?.asunto ?? `Una pregunta sobre ${company.empresa}`,
    cuerpo:
      base?.cuerpo
      ?? `Hola ${company.contacto.split(" ")[0]}, estuve en el sitio de ${company.empresa} y me quedó una pregunta concreta sobre cómo resuelven hoy el trabajo manual.`,
    status: "borrador",
  }
}

export function applyEdit(draft: MailDraft, instruction: string): MailDraft {
  const t = instruction.toLowerCase()
  let { asunto, cuerpo } = draft

  if (/corto|breve|acort/i.test(t)) {
    const parts = cuerpo.split(/(?<=[.!?])\s+/)
    cuerpo = parts.slice(0, Math.max(1, Math.ceil(parts.length * 0.55))).join(" ")
  }
  if (/tuteo|tut[eé]|más cercano|cercano/i.test(t)) {
    cuerpo = cuerpo
      .replace(/\bUstedes\b/g, "Ustedes")
      .replace(/\busted\b/gi, "vos")
      .replace(/\bsu equipo\b/gi, "tu equipo")
  }
  const drop = t.match(/no (?:menciones|digas|hables de) (.+?)(?:\.|$)/i)
  if (drop) {
    const word = drop[1].replace(/[“”"']/g, "").trim()
    if (word) cuerpo = cuerpo.replace(new RegExp(word, "gi"), "").replace(/\s{2,}/g, " ")
  }
  if (/mismo cierre|cierre igual|agreg(á|a) cierre/i.test(t)) {
    if (!/15 minutos|esta semana/i.test(cuerpo)) {
      cuerpo = `${cuerpo.trim()}\n\n¿Tenés 15 minutos esta semana para verlo?`
    }
  }
  if (/asunto/.test(t) && /corto/i.test(t)) {
    asunto = asunto.split(" ").slice(0, 6).join(" ")
  }

  return { ...draft, asunto: asunto.trim(), cuerpo: cuerpo.trim().replace(/\s+\n/g, "\n") }
}
