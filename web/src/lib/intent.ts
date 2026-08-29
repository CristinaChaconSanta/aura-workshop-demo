import type { VisibleFilter } from "../types"
import { extractUrls } from "./sites"

export type LandingIntent =
  | { kind: "existing" }
  | { kind: "clarify"; prompt: string }
  | { kind: "search"; query: string; count?: number }
  | { kind: "urls"; urls: string[] }

export type AnalysisIntent =
  | { kind: "filter"; filter: VisibleFilter }
  | { kind: "clear" }
  | { kind: "pageSize"; size: number }
  | { kind: "next" }
  | { kind: "prev" }
  | { kind: "emails"; scope: "all" | "block" | "primero" | "top"; count?: number }
  | { kind: "viewEmails" }
  | { kind: "unknown"; hint: string }

const EXISTING =
  /ya (las )?tenemos|lote actual|desarrollad|mostr(ame|á) las( que)? ya|lista que( ya)? ten|las que ya|abrir el lote|lote existente/i

const VAGUE = /^(busc[áa]r?|empresas|leads|hola|hey|ayuda)?[\s.!?]*$/i

export function parseLandingIntent(text: string): LandingIntent {
  const raw = text.trim()
  if (!raw) return { kind: "clarify", prompt: "Decime qué buscamos, subí una tabla o pedí el lote que ya tenemos." }
  if (EXISTING.test(raw)) return { kind: "existing" }
  const urls = extractUrls(raw)
  if (urls.length) return { kind: "urls", urls }
  if (VAGUE.test(raw) || raw.length < 8) {
    return {
      kind: "clarify",
      prompt:
        "¿Rubro, zona y cuántas? Por ejemplo: clínicas dentales en el norte de Bogotá, 25, con más de 30 reseñas.",
    }
  }
  const countMatch = raw.match(/\b(\d{1,3})\b/)
  const count = countMatch ? Number(countMatch[1]) : undefined
  return { kind: "search", query: raw, count }
}

export function parseAnalysisIntent(text: string): AnalysisIntent {
  const raw = text.trim()
  const lower = raw.toLowerCase()

  if (/limpiar filtro|sin filtro|todas|mostr(ame|á) (todas|todo)/i.test(raw) && !/email/i.test(raw)) {
    return { kind: "clear" }
  }
  if (/siguiente|pr[oó]ximo bloque|pr[oó]ximas/i.test(raw)) return { kind: "next" }
  if (/anterio(r|res)|bloque anterior|atr[aá]s/i.test(raw)) return { kind: "prev" }
  if (/ver (los )?emails|ir a (los )?emails|bandeja/i.test(raw)) return { kind: "viewEmails" }

  const sizeMatch = raw.match(/(?:de a|a|mostr\w* de a|bloques? de)\s*(\d{1,2})/i)
    ?? raw.match(/ver\s+(\d{1,2})\s+(por|en)/i)
  if (sizeMatch) {
    const size = clampPageSize(Number(sizeMatch[1]))
    return { kind: "pageSize", size }
  }

  if (/constru(ye|í|i)|cre[aá]|produc[ií]|arm[aá].*email/i.test(raw)) {
    if (/contactar primero|tag primero|prioridad/i.test(raw)) {
      return { kind: "emails", scope: "primero" }
    }
    if (/este bloque|estas|de este/i.test(raw)) return { kind: "emails", scope: "block" }
    const top = raw.match(/(?:los|las)\s+(\d{1,2})\s+(?:de )?(?:mayor|mejores|top)/i)
    if (top) return { kind: "emails", scope: "top", count: Number(top[1]) }
    const n = raw.match(/(\d{1,2})\s+emails?/i)
    if (n) return { kind: "emails", scope: "top", count: Number(n[1]) }
    return { kind: "emails", scope: "all" }
  }

  const score = lower.match(/score\s*(>=|≥|>|más de|mayor(?:es)? a?)\s*(\d{2,3})/)
    ?? lower.match(/score\s+(\d{2,3})/)
  if (score) {
    const n = Number(score[2] ?? score[1])
    return {
      kind: "filter",
      filter: {
        label: `Score ≥ ${n}`,
        test: (c) => c.score >= n,
      },
    }
  }

  if (/contactar primero|primero/i.test(raw) && /solo|filtro|mostr/i.test(raw)) {
    return {
      kind: "filter",
      filter: { label: "Contactar primero", test: (c) => c.tag === "primero" },
    }
  }

  const tech = raw.match(/(?:usen|usa|con|tecnolog[ií]a)\s+([A-Za-z0-9.]+)/i)
    ?? raw.match(/\b(hubspot|shopify|wordpress|woocommerce|salesforce|whatsapp)\b/i)
  if (tech) {
    const name = tech[1]
    return {
      kind: "filter",
      filter: {
        label: `Tecnología: ${name}`,
        test: (c) =>
          c.ficha.tecnologias_detectadas.some((item) => item.toLowerCase().includes(name.toLowerCase()))
          || (name.toLowerCase() === "whatsapp" && c.ficha.tiene_whatsapp),
      },
    }
  }

  const country = raw.match(/\b(colombia|chile|brasil|brazil|m[eé]xico|mexico|portugal|ee\.?uu\.?|usa)\b/i)
  if (country) {
    const key = country[1].toLowerCase()
    const map: Record<string, string[]> = {
      colombia: ["colombia"],
      chile: ["chile"],
      brasil: ["brazil", "brasil"],
      brazil: ["brazil", "brasil"],
      mexico: ["mexico", "méxico"],
      méxico: ["mexico", "méxico"],
      portugal: ["portugal"],
      usa: ["usa", "united", "ee"],
    }
    const aliases = map[key] ?? [key]
    return {
      kind: "filter",
      filter: {
        label: country[1],
        test: (c) => {
          const hay = `${c.pais} ${c.ficha.ciudad_pais}`.toLowerCase()
          return aliases.some((a) => hay.includes(a))
        },
      },
    }
  }

  const sector = raw.match(/(?:sector|rubro|de)\s+([a-záéíóúñ ]{4,30})/i)
  if (sector && /solo|filtro|mostr/i.test(raw)) {
    const q = sector[1].trim().toLowerCase()
    return {
      kind: "filter",
      filter: {
        label: `Rubro: ${sector[1].trim()}`,
        test: (c) => c.ficha.sector.toLowerCase().includes(q),
      },
    }
  }

  if (/empleado/i.test(raw)) {
    const n = Number(raw.match(/(\d{1,4})/)?.[1] ?? 0)
    return {
      kind: "filter",
      filter: {
        label: n ? `Mención de ${n}+ empleados` : "Mención de empleados",
        note: "No hay un campo de headcount. Filtro por menciones en la ficha.",
        test: (c) => {
          const blob = `${c.ficha.resumen} ${c.ficha.insights.join(" ")}`
          const found = blob.match(/(\d+)\s*emplead/i)
          if (!found) return false
          return n ? Number(found[1]) >= n : true
        },
      },
    }
  }

  return {
    kind: "unknown",
    hint: "Puedo filtrar (país, score, tecnología, rubro), cambiar el bloque (“de a 10”), pasar al siguiente o construir emails.",
  }
}

export function clampPageSize(n: number) {
  return Math.min(50, Math.max(2, Math.round(n)))
}

export function countCsvRows(text: string) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (lines.length <= 1) return lines.length
  return lines.length - 1
}
