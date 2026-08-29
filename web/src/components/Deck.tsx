import { useRef, type PointerEvent } from "react"
import { motion } from "motion/react"
import { cardBadge } from "../lib/briefing"
import type { Company, Origin } from "../types"

type Props = {
  companies: Company[]
  total: number
  rangeLabel: string
  fanned: boolean
  selectedId: string | null
  origin: Origin
  query?: string
  view: "cards" | "list"
  page: number
  pageCount: number
  pageSize: number
  filterLabel?: string
  onSelect: (id: string) => void
  onBack: () => void
  onReset: () => void
  onDashboard: () => void
  onEmails?: () => void
  onView: (view: "cards" | "list") => void
  onPageSize: (size: number) => void
  onPrev: () => void
  onNext: () => void
}

const BADGE_CLASS = {
  primero: "bg-accent text-[#0A0F0A]",
  analisis: "bg-[#3F7A24] text-white",
  email: "bg-[#526C2E] text-white",
  lista: "bg-[#1A2416] text-[#C8D0BC] ring-1 ring-white/15",
}

const DOT_CLASS = {
  primero: "bg-[#9CCF4F]",
  analisis: "bg-[#3F7A24]",
  email: "bg-[#526C2E]",
  lista: "bg-[#6B7A5A]",
}

export function Deck({
  companies,
  total,
  rangeLabel,
  fanned,
  selectedId,
  origin,
  query,
  view,
  page,
  pageCount,
  pageSize,
  filterLabel,
  onSelect,
  onBack,
  onReset,
  onDashboard,
  onEmails,
  onView,
  onPageSize,
  onPrev,
  onNext,
}: Props) {
  const mid = (companies.length - 1) / 2
  const dimmed = Boolean(selectedId)
  const startX = useRef<number | null>(null)
  const fan = companies.length <= 5

  function onPointerDown(event: PointerEvent) {
    startX.current = event.clientX
  }
  function onPointerUp(event: PointerEvent) {
    if (startX.current == null || dimmed) return
    const dx = event.clientX - startX.current
    startX.current = null
    if (dx < -70) onNext()
    if (dx > 70) onPrev()
  }

  const originLabel =
    origin === "search"
      ? `Búsqueda · ${query ?? "Maps (stand-in)"}`
      : origin === "upload"
        ? `Tabla · ${query ?? "archivo"}`
        : origin === "urls"
          ? "Sitios pegados"
          : "Lote desarrollado"

  return (
    <div className="relative flex min-h-svh flex-col px-5 pt-6 pb-36">
      <header className="relative z-20 flex items-center justify-between text-white/70">
        <div className="flex items-center gap-4">
          <button type="button" onClick={onBack} className="text-xs hover:text-white">
            Atrás
          </button>
          <p className="text-[11px] tracking-[0.28em] uppercase">
            Human Lead Intelligence
          </p>
        </div>
        <div className="flex gap-4 text-xs">
          {onEmails ? (
            <button type="button" onClick={onEmails} className="hover:text-white">
              Emails
            </button>
          ) : null}
          <button type="button" onClick={onDashboard} className="hover:text-white">
            Dashboard
          </button>
          <button type="button" onClick={onReset} className="hover:text-white">
            Inicio
          </button>
        </div>
      </header>

      <div className="relative z-20 mt-6 flex flex-wrap items-end justify-between gap-3">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl text-sm text-white/65"
        >
          {originLabel} · {rangeLabel} de {total}
          {filterLabel ? ` · filtro: ${filterLabel}` : ""}
          {dimmed ? " · el expediente está al centro" : ""}
        </motion.p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="mirror flex rounded-full p-0.5">
            <button
              type="button"
              aria-label="Vista tarjetas"
              onClick={() => onView("cards")}
              className={`rounded-full px-3 py-1.5 ${view === "cards" ? "bg-white text-[#14200f]" : "text-white/70"}`}
            >
              Tarjetas
            </button>
            <button
              type="button"
              aria-label="Vista lista"
              onClick={() => onView("list")}
              className={`rounded-full px-3 py-1.5 ${view === "list" ? "bg-white text-[#14200f]" : "text-white/70"}`}
            >
              Lista
            </button>
          </div>
          <label className="flex items-center gap-2 text-white/60">
            Bloque
            <select
              value={pageSize}
              onChange={(event) => onPageSize(Number(event.target.value))}
              className="rounded-full border border-white/20 bg-[#142016] px-2 py-1 text-white outline-none"
            >
              {[2, 5, 8, 10, 15, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {view === "list" ? (
        <div className="relative z-10 mx-auto mt-5 w-full max-w-4xl flex-1">
          <div className="mb-2 hidden grid-cols-[18px_minmax(0,1fr)_180px_92px_88px] gap-3 px-4 text-[10px] tracking-wide text-white/35 uppercase md:grid">
            <span />
            <span>Lead</span>
            <span>Rubro</span>
            <span>País</span>
            <span className="text-right">Score</span>
          </div>
          <div className="space-y-1.5">
            {companies.map((company) => {
              const badge = cardBadge(company)
              return (
                <button
                  key={company.id}
                  type="button"
                  title={badge.label}
                  onClick={() => onSelect(company.id)}
                  className="lead-card grid w-full cursor-pointer grid-cols-[18px_minmax(0,1fr)_88px] items-center gap-3 rounded-[16px] px-4 py-3 text-left transition-colors hover:bg-white/5 md:grid-cols-[18px_minmax(0,1fr)_180px_92px_88px]"
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT_CLASS[badge.kind]}`}
                    aria-label={badge.label}
                  />
                  <span className="font-display min-w-0 truncate text-[15px] font-bold tracking-tight text-[#F4F4EE] uppercase">
                    {company.empresa}
                  </span>
                  <span className="hidden truncate text-xs text-[#C8D0BC] md:block">
                    {company.ficha.sector}
                  </span>
                  <span className="hidden truncate text-[11px] text-[#A8B499] uppercase md:block">
                    {company.pais}
                  </span>
                  <span className="text-right text-[11px] tracking-wide text-[#A8B499] uppercase">
                    Score {company.score}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div
          className="relative mt-4 flex min-h-[400px] flex-1 items-center justify-center"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {fan ? (
            companies.map((company, index) => {
              const offset = index - mid
              const stacked = {
                x: offset * 6,
                y: offset * -8,
                rotate: offset * 2,
                scale: 1,
              }
              const open = {
                x: offset * (companies.length <= 3 ? 250 : 220),
                y: Math.abs(offset) * 16,
                rotate: offset * -1.6,
                scale: 1,
              }
              const back = {
                x: offset * 200,
                y: 70 + Math.abs(offset) * 8,
                rotate: offset * 6,
                scale: 0.64,
                opacity: 0.3,
              }
              const pose = dimmed ? back : fanned ? open : stacked
              return (
                <FanCard
                  key={company.id}
                  company={company}
                  index={index}
                  pose={pose}
                  active={selectedId === company.id}
                  z={selectedId === company.id ? 5 : 10 - Math.abs(offset)}
                  onSelect={onSelect}
                  dimmed={dimmed}
                />
              )
            })
          ) : (
            <div className="flex w-full snap-x gap-4 overflow-x-auto px-2 pb-4">
              {companies.map((company, index) => (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => onSelect(company.id)}
                  className="lead-card relative h-[320px] w-[210px] shrink-0 snap-center overflow-hidden rounded-[26px] text-left"
                >
                  <CardBody company={company} index={index} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="relative z-20 mt-2 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 0}
          className="pill-ghost rounded-full px-4 py-1.5 text-xs disabled:opacity-30"
        >
          Anterior
        </button>
        <p className="text-xs text-white/55">
          {rangeLabel} · bloque {page + 1}/{pageCount}
        </p>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= pageCount - 1}
          className="pill-ghost rounded-full px-4 py-1.5 text-xs disabled:opacity-30"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

function FanCard({
  company,
  index,
  pose,
  active,
  z,
  onSelect,
  dimmed,
}: {
  company: Company
  index: number
  pose: { x: number; y: number; rotate: number; scale: number; opacity?: number }
  active: boolean
  z: number
  onSelect: (id: string) => void
  dimmed: boolean
}) {
  return (
    <motion.button
      type="button"
      layoutId={`card-${company.id}`}
      onClick={() => onSelect(company.id)}
      initial={false}
      animate={{ ...pose, zIndex: z, opacity: pose.opacity ?? 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      whileHover={dimmed ? undefined : { y: pose.y - 12, scale: 1.03 }}
      className={`lead-card absolute h-[340px] w-[220px] overflow-hidden rounded-[26px] text-left ${
        active ? "pointer-events-none opacity-0" : ""
      }`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <CardBody company={company} index={index} />
    </motion.button>
  )
}

function CardBody({ company, index }: { company: Company; index: number }) {
  const badge = cardBadge(company)
  return (
    <>
      <div className="absolute inset-0 opacity-30" style={{ background: cardWash(index) }} />
      <div className="relative flex h-full flex-col p-5">
        <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase ${BADGE_CLASS[badge.kind]}`}>
          {badge.label}
        </span>
        <h3 className="font-display mt-auto text-[22px] leading-[1.08] font-bold tracking-tight text-[#F4F4EE] uppercase">
          {company.empresa}
        </h3>
        <p className="mt-3 text-xs text-[#C8D0BC]">{company.ficha.sector}</p>
        <p className="mt-4 text-[11px] tracking-wide text-[#A8B499] uppercase">
          Score {company.score} · {company.prioridad}
        </p>
      </div>
    </>
  )
}

function cardWash(index: number) {
  const washes = [
    "linear-gradient(160deg, rgba(63,122,36,0.28), transparent)",
    "linear-gradient(160deg, rgba(14,42,16,0.35), transparent)",
    "linear-gradient(160deg, rgba(82,108,46,0.22), transparent)",
    "linear-gradient(160deg, rgba(10,15,10,0.28), transparent)",
    "linear-gradient(160deg, rgba(63,122,36,0.18), transparent)",
  ]
  return washes[index % washes.length]
}
