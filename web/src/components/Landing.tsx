import { motion } from "motion/react"
import { AuraHero } from "../scene/AuraHero"
import { AgentBar } from "./AgentBar"
import type { ChatMessage } from "../types"

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: (text: string) => void
  onFile: (file: File) => void
  onExisting: () => void
  existingCount?: number
  busy?: boolean
  messages: ChatMessage[]
}

export function Landing({
  value,
  onChange,
  onSubmit,
  onFile,
  onExisting,
  existingCount,
  busy,
  messages,
}: Props) {
  return (
    <div className="relative flex min-h-svh flex-col items-center px-6 pt-8 pb-10 text-center">
      <AuraHero />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pointer-events-none relative z-10 text-[11px] tracking-[0.32em] text-white/60 uppercase"
        style={{ textShadow: "0 1px 10px rgba(6,10,6,0.7)" }}
      >
        Aura Studio
      </motion.p>

      <div className="pointer-events-none relative z-10 flex w-full flex-1 flex-col items-center justify-center">
        <div className="relative flex w-full max-w-3xl flex-col items-center px-4 py-8">
          <div className="relative flex w-full flex-col items-center">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[210px] w-[min(100%,680px)] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(ellipse 68% 52% at 50% 48%, rgba(6,10,6,0.42) 0%, rgba(6,10,6,0.14) 46%, transparent 72%)",
                filter: "blur(26px)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mirror relative flex items-center gap-3 rounded-full px-5 py-2.5"
            >
              <span className="h-2 w-2 rounded-full bg-sage" />
              <span className="text-[12px] tracking-wide text-white/90">
                In pursuit of time returned
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="font-display relative mt-5 max-w-3xl text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-6xl"
              style={{ textShadow: "0 2px 18px rgba(6,10,6,0.72), 0 0 28px rgba(6,10,6,0.4)" }}
            >
              Human Lead Intelligence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.48 }}
              className="relative mt-4 max-w-lg text-[15px] leading-relaxed text-white/88"
              style={{ textShadow: "0 1px 12px rgba(6,10,6,0.78), 0 0 18px rgba(6,10,6,0.42)" }}
            >
              Decime qué buscamos, pegá sitios web, subí una tabla, o pedí el lote que ya tenemos.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pointer-events-auto relative mx-auto mt-8 flex w-full max-w-2xl flex-col items-center"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-4 h-[120px] w-[min(100%,620px)] -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(ellipse 72% 48% at 50% 40%, rgba(6,10,6,0.32) 0%, transparent 70%)",
                filter: "blur(22px)",
              }}
            />
            <AgentBar
              variant="landing"
              value={value}
              onChange={onChange}
              onSubmit={onSubmit}
              onFile={onFile}
              busy={busy}
              messages={messages}
            />
            <button
              type="button"
              onClick={onExisting}
              className="relative mt-5 inline-flex items-center gap-2 text-[13px] text-white/85 transition-colors hover:text-[#9CCF4F]"
              style={{ textShadow: "0 1px 10px rgba(6,10,6,0.82), 0 0 14px rgba(6,10,6,0.4)" }}
            >
              <FolderIcon />
              Archivos existentes
              {existingCount != null ? ` (${existingCount})` : ""}
            </button>
            <p
              className="relative mt-4 max-w-md text-center text-[12px] leading-relaxed text-white/82"
              style={{ textShadow: "0 1px 10px rgba(6,10,6,0.82), 0 0 14px rgba(6,10,6,0.4)" }}
            >
              Te recomendamos solicitar entre 20 y 50 búsquedas máximo por industria.
              Si una empresa ya está en tu base, no se vuelve a agregar.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function FolderIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4.2c.4 0 .8.16 1.1.44L12.5 7H18.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
