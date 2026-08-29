import type { Company } from "../types"

export function briefingLines(companies: Company[]) {
  const first = companies.find((c) => c.tag === "primero")
  const analysis = companies.find((c) => c.tag === "analisis")
  const email = companies.find((c) => c.tag === "email")
  return {
    first: first?.empresa ?? companies[0]?.empresa,
    analysis: analysis?.empresa ?? companies[1]?.empresa,
    email: email?.empresa ?? companies[companies.length - 1]?.empresa,
  }
}

export function briefingInsights(companies: Company[]) {
  if (!companies.length) return []
  const lines = briefingLines(companies)
  const items = [
    { id: "first", text: `Contactá primero ${lines.first}.` },
    { id: "analysis", text: `El análisis más sólido es ${lines.analysis}.` },
    { id: "email", text: `El email que no podés mandar genérico es ${lines.email}.` },
  ]
  const hot = companies.filter((c) => c.score >= 70)
  if (hot.length) {
    items.push({
      id: "score",
      text: `${hot.length} con score ≥ 70 en este recorte.`,
    })
  }
  return items
}

export const TAG_LABEL: Record<Exclude<Company["tag"], null>, string> = {
  primero: "Contactar primero",
  analisis: "Mejor análisis",
  email: "Email a cuidar",
}

export function cardBadge(company: Company) {
  if (company.tag === "primero") return { label: TAG_LABEL.primero, kind: "primero" as const }
  if (company.tag === "analisis") return { label: TAG_LABEL.analisis, kind: "analisis" as const }
  if (company.tag === "email") return { label: TAG_LABEL.email, kind: "email" as const }
  return { label: "En lista", kind: "lista" as const }
}
