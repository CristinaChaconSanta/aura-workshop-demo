import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { briefingInsights } from "../lib/briefing"
import type { Company } from "../types"

type Props = {
  companies: Company[]
  hidden?: boolean
}

export function AgentNote({ companies, hidden }: Props) {
  const insights = briefingInsights(companies)
  const fingerprint = insights.map((item) => item.text).join("|")
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState("")
  const root = useRef<HTMLDivElement>(null)
  const unread = seen !== fingerprint && insights.length > 0

  useEffect(() => {
    if (open) setSeen(fingerprint)
  }, [open, fingerprint])

  useEffect(() => {
    if (!open) return
    function onDoc(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  if (hidden) return null

  return (
    <div ref={root} className="absolute bottom-32 left-5 z-30">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="agent-panel mb-3 w-[min(22rem,calc(100vw-2.5rem))] rounded-[22px] px-4 py-3 text-[13px] leading-relaxed text-[#F4F4EE]"
          >
            <p className="text-[10px] tracking-[0.22em] text-white/45 uppercase">
              Agente
            </p>
            <ul className="mt-2 max-h-52 space-y-2.5 overflow-y-auto pr-1">
              {insights.map((item) => (
                <li key={item.id} className="text-white/85">
                  {item.text}
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex items-center gap-2 rounded-full border border-[#9CCF4F]/35 bg-[#142016]/90 px-3 py-2 text-[12px] text-[#C8D0BC] shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-md hover:border-[#9CCF4F]/60 hover:text-white"
        aria-expanded={open}
        aria-label="Agente"
      >
        {unread ? (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#9CCF4F]" />
        ) : null}
        <SparkIcon />
        Agente
      </button>
    </div>
  )
}

function SparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5 13.2 9l5.8 1.2L13.2 11.4 12 16.8l-1.2-5.4L5 10.2 10.8 9 12 3.5Z"
        stroke="#9CCF4F"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
