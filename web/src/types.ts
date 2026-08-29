export type BriefingTag = "primero" | "analisis" | "email" | null

export type Company = {
  id: string
  empresa: string
  contacto: string
  cargo: string
  email: string
  pais: string
  url: string
  score: number
  prioridad: string
  producto: string
  tag: BriefingTag
  ficha: {
    resumen: string
    sector: string
    ciudad_pais: string
    modelo_negocio: string
    propuesta_valor: string
    madurez_digital: { nivel: string; razon: string }
    tiene_whatsapp: boolean
    tiene_blog: boolean
    tiene_ecommerce: boolean
    tecnologias_detectadas: string[]
    senales_oportunidad: string[]
    brechas_competitivas: string[]
    angulos_personalizacion: { angulo: string; evidencia: string }[]
    servicios_aura_sugeridos: { servicio: string; justificacion: string }[]
    propuestas_creativas: string[]
    insights: string[]
    temperatura_mercado: string
    evidencia_temperatura: string
    costo_cambio_estimado: string
    evidencia_costo_cambio: string
    estructura_decision: string
    horas_recuperables_semana?: { min: number; max: number; evidencia?: string }
    fit_aura: string
    razon_fit: string
  }
  estimacion?: {
    horas_min?: number
    horas_max?: number
    evidencia?: string
    valor_anual_min?: number
    valor_anual_max?: number
    precio_min?: number
    precio_max?: number
    supuestos?: string
  } | null
}

export type Stage = "landing" | "deck" | "emails" | "dashboard"

export type Origin = "search" | "list" | "upload" | "urls"

export type EmailStatus = "borrador" | "listo" | "enviado"

export type MailDraft = {
  companyId: string
  asunto: string
  cuerpo: string
  status: EmailStatus
}

export type VisibleFilter = {
  label: string
  test: (company: Company) => boolean
  note?: string
}

export type ChatMessage = {
  role: "agent" | "you"
  text: string
}
