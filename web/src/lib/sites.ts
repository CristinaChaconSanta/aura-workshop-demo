import type { Company } from "../types"

const URL_RE =
  /(?:https?:\/\/|www\.)[^\s,;]+|\b[a-z0-9][-a-z0-9]*\.(?:com|co|io|net|org|ai|app|cl|mx|br|ar|pt|es|dev)(?:\.[a-z]{2})?(?:\/[^\s,;]*)?/gi

export function extractUrls(text: string): string[] {
  const found = text.match(URL_RE) ?? []
  const seen = new Set<string>()
  const urls: string[] = []
  for (const raw of found) {
    const href = normalizeUrl(raw)
    const host = hostOf(href)
    if (!host || seen.has(host)) continue
    seen.add(host)
    urls.push(href)
  }
  return urls
}

export function companiesFromUrls(urls: string[]): Company[] {
  return urls.map((href, index) => {
    const host = hostOf(href)
    const name = brandFromHost(host)
    const id = host.replace(/\./g, "-") || `sitio-${index + 1}`
    return {
      id,
      empresa: name,
      contacto: "—",
      cargo: "—",
      email: "—",
      pais: "—",
      url: href,
      score: 0,
      prioridad: "Sin análisis",
      producto: "Sin análisis",
      tag: null,
      ficha: {
        resumen: `Sitio ingresado: ${href}. Todavía no hay scraping: no invento modelo de negocio, stack ni señales.`,
        sector: "sin evidencia",
        ciudad_pais: "sin evidencia",
        modelo_negocio: "sin evidencia",
        propuesta_valor: "sin evidencia",
        madurez_digital: {
          nivel: "sin evidencia",
          razon: "El sitio se pegó en la barra. Falta leer el HTML.",
        },
        tiene_whatsapp: false,
        tiene_blog: false,
        tiene_ecommerce: false,
        tecnologias_detectadas: [],
        senales_oportunidad: [],
        brechas_competitivas: [],
        angulos_personalizacion: [],
        servicios_aura_sugeridos: [],
        propuestas_creativas: [],
        insights: [`URL cargada por la persona: ${href}`],
        temperatura_mercado: "sin evidencia",
        evidencia_temperatura: "Sin señales públicas leídas todavía.",
        costo_cambio_estimado: "sin evidencia",
        evidencia_costo_cambio: "Sin evidencia.",
        estructura_decision: "sin evidencia",
        fit_aura: "sin evidencia",
        razon_fit: "Falta ficha de sitio.",
      },
      estimacion: null,
    }
  })
}

function normalizeUrl(raw: string) {
  const trimmed = raw.replace(/[),.;]+$/g, "")
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/\//, "")}`
}

function hostOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "").toLowerCase()
  } catch {
    return ""
  }
}

function brandFromHost(host: string) {
  const base = host.split(".")[0] ?? host
  return base.charAt(0).toUpperCase() + base.slice(1)
}
