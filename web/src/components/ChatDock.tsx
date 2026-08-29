import { useState, type FormEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import type { ChatMessage } from "../types"

type Props = {
  open: boolean
  messages: ChatMessage[]
  onSend: (text: string) => void
}

export function ChatDock({ open, messages, onSend }: Props) {
  const [text, setText] = useState("")
  if (!open) return null

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const next = text.trim()
    if (!next) return
    onSend(next)
    setText("")
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mirror-deep absolute right-5 bottom-5 z-40 flex h-[360px] w-[min(380px,calc(100vw-2.5rem))] flex-col rounded-[24px] text-white"
    >
      <p className="px-4 pt-4 text-[10px] tracking-[0.22em] text-white/45 uppercase">
        Agente
      </p>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-[13px] leading-relaxed">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.p
              key={`${msg.role}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                msg.role === "agent"
                  ? "text-white/85"
                  : "rounded-2xl bg-white/10 px-3 py-2 text-right"
              }
            >
              {msg.text}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
      <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/35"
          placeholder="ej. 45, 23 y 125 minutos"
        />
      </form>
    </motion.div>
  )
}
