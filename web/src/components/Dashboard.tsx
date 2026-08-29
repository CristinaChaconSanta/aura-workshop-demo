import type { ReactNode } from "react"
import { motion } from "motion/react"
import { formatGaps } from "../lib/schedule"

type Props = {
  gaps: number[]
  drafted: number
  onBack: () => void
}

export function Dashboard({ gaps, drafted, onBack }: Props) {
  return (
    <div className="relative z-10 mx-auto flex min-h-svh max-w-5xl flex-col px-6 py-8 text-white">
      <header className="flex items-center justify-between">
        <p className="text-[11px] tracking-[0.28em] text-white/50 uppercase">
          Post-contacto
        </p>
        <button type="button" onClick={onBack} className="text-xs text-white/60">
          Volver al mazo
        </button>
      </header>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display mt-8 text-4xl font-extrabold tracking-tight uppercase"
      >
        Después del envío
      </motion.h1>
      <p className="mt-2 max-w-xl text-sm text-white/65">
        Maqueta con el lote de 5. Los números se llenan cuando Gmail detecte
        respuestas reales. Patrón: {gaps.length ? formatGaps(gaps) : "sin definir"}.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Borradores" value={String(drafted)} delay={0.05} />
        <Stat label="Citas cerradas" value="1" delay={0.12} />
        <Stat label="Respuestas" value="2" delay={0.2} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel title="Industrias del lote" delay={0.25}>
          <Bar label="Consultoría / innovación" pct={32} />
          <Bar label="Marketing y field" pct={28} />
          <Bar label="Equipos industriales" pct={22} />
          <Bar label="Energía / otros" pct={18} />
        </Panel>
        <Panel title="Psicología de las respuestas" delay={0.32}>
          <p>
            Palabras que aparecen: <em>prioridad</em>, <em>sentido</em>,{" "}
            <em>después</em>. Tono de diferir, no de rechazo.
          </p>
          <p className="mt-3 text-white/70">
            Baja presión (BYAF) correlaciona con respuestas más largas. Cero FOMO
            en los borradores. La curiosidad abierta pidió una aclaración, no una
            demo.
          </p>
        </Panel>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  delay,
}: {
  label: string
  value: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mirror rounded-[24px] px-5 py-6"
    >
      <p className="text-[11px] tracking-[0.2em] text-white/45 uppercase">
        {label}
      </p>
      <p className="font-display mt-2 text-4xl font-bold">{value}</p>
    </motion.div>
  )
}

function Panel({
  title,
  delay,
  children,
}: {
  title: string
  delay: number
  children: ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mirror-deep rounded-[24px] px-5 py-6 text-sm leading-relaxed"
    >
      <h2 className="text-[11px] tracking-[0.2em] text-white/45 uppercase">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </motion.section>
  )
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-xs text-white/65">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="h-full bg-white/80"
        />
      </div>
    </div>
  )
}
