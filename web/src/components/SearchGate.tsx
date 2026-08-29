import { useState, type FormEvent } from "react"
import { motion } from "motion/react"

type Props = {
  busy: boolean
  onBack: () => void
  onSubmit: (query: string) => void
}

export function SearchGate({ busy, onBack, onSubmit }: Props) {
  const [query, setQuery] = useState("lavanderías en Bogotá")

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!query.trim() || busy) return
    onSubmit(query.trim())
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="mirror-deep w-full max-w-xl rounded-[28px] px-7 py-8 text-left text-white"
      >
        <p className="text-[11px] tracking-[0.22em] text-white/50 uppercase">
          Búsqueda
        </p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight uppercase">
          ¿A quién rastreamos?
        </h2>
        <p className="mt-2 text-sm text-white/65">
          Rubro y ciudad. Esta maqueta se limita a 5.
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={busy}
          className="mt-6 w-full rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-white outline-none placeholder:text-white/40"
          placeholder="ej. clínicas dentales en Medellín"
        />
        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="pill-solid rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {busy ? "Rastreando…" : "Rastrear (máx. 5)"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-white/55 underline-offset-4 hover:underline"
          >
            Volver
          </button>
        </div>
      </motion.form>
    </div>
  )
}
