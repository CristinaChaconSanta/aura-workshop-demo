import type { ReactNode } from "react"
import { motion } from "motion/react"
import type { Company, MailDraft } from "../types"

type Props = {
  company: Company
  draft?: MailDraft
  onClose: () => void
  onCreateOne: () => void
  onCreateAll: () => void
  onViewEmails: () => void
}

export function Expediente({
  company,
  draft,
  onClose,
  onCreateOne,
  onCreateAll,
  onViewEmails,
}: Props) {
  const { ficha, estimacion } = company
  const drafted = Boolean(draft)

  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/25"
      />
      <motion.article
        layoutId={`card-${company.id}`}
        initial={{ scale: 0.86, rotateX: 8 }}
        animate={{ scale: 1, rotateX: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="mirror-deep relative flex max-h-[90svh] w-full max-w-3xl flex-col overflow-hidden rounded-[32px] text-white"
      >
        <div className="relative flex items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div>
            <p className="text-[11px] tracking-[0.22em] text-white/50 uppercase">
              Expediente completo
            </p>
            <h2 className="font-display mt-1 text-3xl font-bold tracking-tight uppercase">
              {company.empresa}
            </h2>
            <p className="mt-1 text-sm text-white/65">
              {company.contacto} — {company.cargo}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pill-ghost rounded-full px-3 py-1 text-xs"
          >
            Cerrar
          </button>
        </div>

        <div className="relative flex-1 space-y-5 overflow-y-auto px-6 py-2 text-[14px] leading-relaxed text-white/90">
          <div className="flex flex-wrap gap-2 text-[11px] tracking-wide uppercase">
            <Chip>
              Score {company.score} · {company.prioridad}
            </Chip>
            <Chip>{company.producto}</Chip>
            <Chip>{ficha.temperatura_mercado}</Chip>
            <Chip>Fit {ficha.fit_aura}</Chip>
          </div>

          <Block title="Resumen">{ficha.resumen}</Block>
          <Block title="Sector / lugar">
            {ficha.sector} · {ficha.ciudad_pais}
          </Block>
          <Block title="Modelo de negocio">{ficha.modelo_negocio}</Block>
          <Block title="Propuesta de valor">{ficha.propuesta_valor}</Block>
          <Block title="Madurez digital">
            {ficha.madurez_digital.nivel} — {ficha.madurez_digital.razon}
          </Block>
          <List title="Señales de oportunidad" items={ficha.senales_oportunidad} />
          <List title="Brechas competitivas" items={ficha.brechas_competitivas} />

          <section>
            <h3 className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
              Ángulos de personalización
            </h3>
            <ul className="mt-2 space-y-2">
              {ficha.angulos_personalizacion.map((item) => (
                <li key={item.angulo}>
                  {item.angulo}
                  <span className="mt-0.5 block text-[12px] text-white/45">
                    Evidencia: {item.evidencia}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <Block title="Temperatura">
            {ficha.temperatura_mercado} — {ficha.evidencia_temperatura}
          </Block>
          <Block title="Costo de cambio">
            {ficha.costo_cambio_estimado} — {ficha.evidencia_costo_cambio}
          </Block>
          <Block title="Estructura de decisión">{ficha.estructura_decision}</Block>
          <Block title="Fit Aura">
            {ficha.fit_aura} — {ficha.razon_fit}
          </Block>

          {estimacion && (
            <Block title="Estimación de valor (interna)">
              {[
                estimacion.horas_min != null &&
                  `${estimacion.horas_min}–${estimacion.horas_max} h/semana`,
                estimacion.valor_anual_min != null &&
                  `valor anual USD ${estimacion.valor_anual_min.toLocaleString()}–${estimacion.valor_anual_max?.toLocaleString()}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </Block>
          )}

          <List title="Insights" items={ficha.insights} />
          <List title="Propuestas creativas" items={ficha.propuestas_creativas} />

          {drafted && draft && (
            <section className="mirror rounded-2xl p-4">
              <h3 className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
                Borrador
              </h3>
              <p className="mt-2 font-medium">{draft.asunto}</p>
              <p className="mt-2 text-white/75">{draft.cuerpo}</p>
            </section>
          )}
        </div>

        <div className="relative flex flex-wrap gap-2 border-t border-white/10 px-6 py-4">
          {!drafted ? (
            <>
              <button
                type="button"
                onClick={onCreateOne}
                className="pill-solid rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Crear email
              </button>
              <button
                type="button"
                onClick={onCreateAll}
                className="pill-ghost rounded-full px-5 py-2.5 text-sm"
              >
                Crear todos los emails
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onViewEmails}
              className="pill-solid rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Ver emails
            </button>
          )}
        </div>
      </motion.article>
    </motion.div>
  )
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-white/10 px-2.5 py-1">{children}</span>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
        {title}
      </h3>
      <p className="mt-1.5">{children}</p>
    </section>
  )
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null
  return (
    <section>
      <h3 className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
        {title}
      </h3>
      <ul className="mt-2 list-disc space-y-1 pl-4">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
