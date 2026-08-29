import { useRef, type FormEvent, type KeyboardEvent } from "react"
import type { ChatMessage } from "../types"

type Props = {
  variant: "landing" | "dock"
  value: string
  onChange: (value: string) => void
  onSubmit: (text: string) => void
  onFile?: (file: File) => void
  busy?: boolean
  placeholder?: string
  notice?: string
  messages?: ChatMessage[]
}

export function AgentBar({
  variant,
  value = "",
  onChange,
  onSubmit,
  onFile,
  busy = false,
  placeholder = "Buscá en Maps, pegá sitios web, subí una tabla, o pedí el lote",
  notice,
  messages = [],
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const landing = variant === "landing"

  function send() {
    const next = value.trim()
    if (!next || busy) return
    onSubmit(next)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    send()
  }

  function handleKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <div className={landing ? "mx-auto w-full max-w-2xl text-left" : "w-full text-left"}>
      {messages.length > 0 ? (
        <div className={`mb-3 space-y-2 ${landing ? "max-h-36 overflow-y-auto" : "max-h-28 overflow-y-auto"}`}>
          {messages.slice(-4).map((msg, i) => (
            <p
              key={`${msg.role}-${i}-${msg.text.slice(0, 12)}`}
              className={
                msg.role === "agent"
                  ? "text-[13px] leading-relaxed text-white/80"
                  : "text-right text-[13px] text-white/60"
              }
            >
              {msg.text}
            </p>
          ))}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mirror-deep flex items-end gap-2 rounded-[28px] px-3 py-2.5 sm:px-4">
        {onFile ? (
          <>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls,.tsv,text/csv"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) onFile(file)
                event.target.value = ""
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="mb-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Subir tabla"
            >
              <ClipIcon />
            </button>
          </>
        ) : null}
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKey}
          disabled={busy}
          rows={landing ? 2 : 1}
          placeholder={placeholder}
          className="min-h-10 flex-1 resize-none bg-transparent py-2 text-[14px] text-white outline-none placeholder:text-white/40"
        />
        <button
          type="submit"
          disabled={busy || !value.trim()}
          className="pill-solid mb-0.5 shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold disabled:opacity-50"
        >
          {busy ? "…" : "Enviar"}
        </button>
      </form>

      {notice ? (
        <p className="mt-3 text-center text-[12px] leading-relaxed text-white/50">
          {notice}
        </p>
      ) : null}
    </div>
  )
}

function ClipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 8.5 10.6 18.9a4 4 0 0 1-5.7-5.7L15.3 3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}
