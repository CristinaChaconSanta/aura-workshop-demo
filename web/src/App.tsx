import { useEffect, useMemo, useState } from "react"
import { AnimatePresence } from "motion/react"
import companiesData from "./data/companies.json" with { type: "json" }
import { AgentBar } from "./components/AgentBar"
import { AgentNote } from "./components/AgentNote"
import { Dashboard } from "./components/Dashboard"
import { Deck } from "./components/Deck"
import { EmailDesk } from "./components/EmailDesk"
import { Expediente } from "./components/Expediente"
import { Landing } from "./components/Landing"
import { hashFor, sameRoute, type Route } from "./lib/history"
import { clampPageSize, countCsvRows, parseAnalysisIntent, parseLandingIntent } from "./lib/intent"
import { companiesFromUrls } from "./lib/sites"
import { applyEdit, seedDraft } from "./lib/mail"
import { formatGaps, parseGaps } from "./lib/schedule"
import type { ChatMessage, Company, MailDraft, Origin, Stage, VisibleFilter } from "./types"

const ALL = companiesData as Company[]
const HOME: Route = { stage: "landing", selectedId: null }

export default function App() {
  const [lote, setLote] = useState<Company[]>(ALL)
  const [stage, setStage] = useState<Stage>("landing")
  const [origin, setOrigin] = useState<Origin>("list")
  const [query, setQuery] = useState("")
  const [busy, setBusy] = useState(false)
  const [fanned, setFanned] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [landingInput, setLandingInput] = useState("")
  const [landingMessages, setLandingMessages] = useState<ChatMessage[]>([])
  const [analysisInput, setAnalysisInput] = useState("")
  const [analysisMessages, setAnalysisMessages] = useState<ChatMessage[]>([])
  const [view, setView] = useState<"cards" | "list">("cards")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState<VisibleFilter | null>(null)
  const [drafts, setDrafts] = useState<Record<string, MailDraft>>({})
  const [gaps, setGaps] = useState<number[]>([])
  const [sendNote, setSendNote] = useState("")

  const filtered = useMemo(
    () => (filter ? lote.filter(filter.test) : lote),
    [lote, filter],
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize) || 1)
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize)
  const rangeStart = filtered.length ? safePage * pageSize + 1 : 0
  const rangeEnd = Math.min(filtered.length, (safePage + 1) * pageSize)
  const rangeLabel = `${rangeStart}–${rangeEnd}`
  const selected = lote.find((c) => c.id === selectedId) ?? null
  const currentRoute: Route = { stage, selectedId }
  const hasDrafts = Object.keys(drafts).length > 0

  function applyRoute(route: Route) {
    setStage(route.stage)
    setSelectedId(route.selectedId)
    if (route.stage === "deck") setFanned(true)
  }

  function navigate(route: Route, mode: "push" | "replace" = "push") {
    if (sameRoute(route, currentRoute) && mode === "push") return
    applyRoute(route)
    const url = hashFor(route)
    if (mode === "replace") window.history.replaceState(route, "", url)
    else window.history.pushState(route, "", url)
  }

  useEffect(() => {
    window.history.replaceState(HOME, "", "#/")
    function onPop(event: PopStateEvent) {
      applyRoute((event.state as Route | null) ?? HOME)
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  function openAnalysis(nextOrigin: Origin, nextQuery: string, agentLine: string) {
    setOrigin(nextOrigin)
    setQuery(nextQuery)
    setFilter(null)
    setPage(0)
    setFanned(false)
    setAnalysisMessages([{ role: "agent", text: agentLine }])
    navigate({ stage: "deck", selectedId: null })
    window.setTimeout(() => setFanned(true), 480)
  }

  function handleLanding(text: string) {
    const intent = parseLandingIntent(text)
    setLandingMessages((prev) => [...prev, { role: "you", text }])
    setLandingInput("")
    if (intent.kind === "clarify") {
      setLandingMessages((prev) => [...prev, { role: "agent", text: intent.prompt }])
      return
    }
    if (intent.kind === "existing") {
      setLote(ALL)
      openAnalysis("list", "", `Abro el lote desarrollado (${ALL.length}). Sin duplicar.`)
      return
    }
    if (intent.kind === "urls") {
      const next = companiesFromUrls(intent.urls)
      setLote(next)
      const note =
        next.length === 1
          ? `Armé la ficha de ${next[0].empresa} (${next[0].url}). Todavía no leo el sitio: no invento señales.`
          : `Armé fichas de ${next.length} sitios. Todavía no hay scraping en vivo: no invento datos del HTML.`
      setLandingMessages((prev) => [...prev, { role: "agent", text: note }])
      openAnalysis("urls", intent.urls.join(" "), note)
      return
    }
    setBusy(true)
    const asked = intent.count
    const note = asked && asked > 50
      ? `Pediste ${asked}. El tope que recomendamos es 50 por industria; cuando Maps esté conectado recorto ahí.`
      : asked
        ? `Pediste ${asked}. Maps es stand-in: trabajo con las ${ALL.length} ya desarrolladas y no duplico.`
        : `Anoté “${intent.query}”. Maps es stand-in: lote desarrollado de ${ALL.length}, sin duplicar.`
    window.setTimeout(() => {
      setBusy(false)
      setLote(ALL)
      setLandingMessages((prev) => [...prev, { role: "agent", text: note }])
      openAnalysis("search", intent.query, note)
    }, 700)
  }

  function handleFile(file: File) {
    setBusy(true)
    const reader = new FileReader()
    reader.onload = () => {
      const rows = typeof reader.result === "string" ? countCsvRows(reader.result) : 0
      const note = `Leí ${file.name} (${rows || "?"} filas). ${ALL.length} ya estaban en base; no las volví a agregar. Trabajo con el lote desarrollado.`
      setBusy(false)
      setLandingMessages((prev) => [
        ...prev,
        { role: "you", text: `Subí ${file.name}` },
        { role: "agent", text: note },
      ])
      setLote(ALL)
      openAnalysis("upload", file.name, note)
    }
    reader.onerror = () => {
      setBusy(false)
      setLandingMessages((prev) => [
        ...prev,
        { role: "agent", text: "No pude leer el archivo. Probá CSV o pedí el lote que ya tenemos." },
      ])
    }
    reader.readAsText(file)
  }

  function goBack() {
    if (window.history.state) window.history.back()
    else navigate(HOME, "replace")
  }

  function reset() {
    setFanned(false)
    setQuery("")
    setBusy(false)
    setDrafts({})
    setLandingInput("")
    setLandingMessages([])
    setAnalysisInput("")
    setAnalysisMessages([])
    setFilter(null)
    setPage(0)
    setGaps([])
    setSendNote("")
    setView("cards")
    setLote(ALL)
    navigate(HOME, "replace")
  }

  function upsertDrafts(ids: string[]) {
    setDrafts((prev) => {
      const next = { ...prev }
      for (const id of ids) {
        const company = lote.find((c) => c.id === id)
        if (company && !next[id]) next[id] = seedDraft(company)
      }
      return next
    })
  }

  function handleAnalysis(text: string) {
    const intent = parseAnalysisIntent(text)
    const replies: ChatMessage[] = [{ role: "you", text }]
    if (intent.kind === "clear") {
      setFilter(null)
      setPage(0)
      replies.push({ role: "agent", text: `Sin filtro. ${lote.length} empresas.` })
    } else if (intent.kind === "filter") {
      const count = lote.filter(intent.filter.test).length
      setFilter(intent.filter)
      setPage(0)
      replies.push({
        role: "agent",
        text: `${intent.filter.label}: ${count} de ${lote.length}.${intent.filter.note ? ` ${intent.filter.note}` : ""}`,
      })
    } else if (intent.kind === "pageSize") {
      setPageSize(intent.size)
      setPage(0)
      replies.push({ role: "agent", text: `Veo de a ${intent.size}.` })
    } else if (intent.kind === "next") {
      setPage((p) => Math.min(p + 1, pageCount - 1))
      replies.push({ role: "agent", text: "Paso al siguiente bloque." })
    } else if (intent.kind === "prev") {
      setPage((p) => Math.max(0, p - 1))
      replies.push({ role: "agent", text: "Vuelvo al bloque anterior." })
    } else if (intent.kind === "viewEmails") {
      if (!hasDrafts) replies.push({ role: "agent", text: "Todavía no hay borradores. Pedime construir los emails." })
      else {
        replies.push({ role: "agent", text: "Abro la landing de emails." })
        navigate({ stage: "emails", selectedId: null })
      }
    } else if (intent.kind === "emails") {
      let ids = filtered.map((c) => c.id)
      if (intent.scope === "block") ids = pageItems.map((c) => c.id)
      if (intent.scope === "primero") ids = filtered.filter((c) => c.tag === "primero").map((c) => c.id)
      if (intent.scope === "top") {
        const n = intent.count ?? pageItems.length
        ids = [...filtered].sort((a, b) => b.score - a.score).slice(0, n).map((c) => c.id)
      }
      upsertDrafts(ids)
      replies.push({
        role: "agent",
        text: `Armé ${ids.length} borradores. Abro la bandeja para verlos, editarlos o enviarlos.`,
      })
      window.setTimeout(() => navigate({ stage: "emails", selectedId: null }), 400)
    } else {
      replies.push({ role: "agent", text: intent.hint })
    }
    setAnalysisMessages((prev) => [...prev, ...replies])
    setAnalysisInput("")
  }

  function handleSchedule(text: string) {
    const found = parseGaps(text)
    if (found.length >= 2) {
      setGaps(found)
      setSendNote(`Plan: un envío y después ${formatGaps(found)} entre cada uno. Nada sale en metrónomo.`)
      return
    }
    if (/ahora|hoy/i.test(text) && /mañana/i.test(text)) {
      setSendNote("Plan: este bloque ahora; el resto mañana.")
      return
    }
    if (/mañana/i.test(text)) {
      setSendNote("Plan: todos mañana.")
      return
    }
    setSendNote("Anoté la orden. Si querés huecos, pasame minutos (45, 23, 125).")
  }

  return (
    <div className={`${stage === "landing" ? "landing-hero" : "aura-scene"} relative min-h-svh overflow-hidden`}>
      {stage === "landing" && (
        <Landing
          value={landingInput}
          onChange={setLandingInput}
          onSubmit={handleLanding}
          onFile={handleFile}
          onExisting={() => {
            setLote(ALL)
            openAnalysis("list", "", `Abro el lote desarrollado (${ALL.length}). Sin duplicar.`)
          }}
          existingCount={ALL.length}
          busy={busy}
          messages={landingMessages}
        />
      )}

      {stage === "deck" && (
        <>
          <Deck
            companies={pageItems}
            total={filtered.length}
            rangeLabel={rangeLabel}
            fanned={fanned}
            selectedId={selectedId}
            origin={origin}
            query={query}
            view={view}
            page={safePage}
            pageCount={pageCount}
            pageSize={pageSize}
            filterLabel={filter?.label}
            onSelect={(id) => {
              if (selectedId === id) goBack()
              else navigate({ stage: "deck", selectedId: id })
            }}
            onBack={goBack}
            onReset={reset}
            onDashboard={() => navigate({ stage: "dashboard", selectedId: null })}
            onEmails={hasDrafts ? () => navigate({ stage: "emails", selectedId: null }) : undefined}
            onView={setView}
            onPageSize={(size) => {
              setPageSize(clampPageSize(size))
              setPage(0)
            }}
            onPrev={() => setPage((p) => Math.max(0, p - 1))}
            onNext={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
          />
          <AgentNote companies={filtered} hidden={Boolean(selected)} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-4 pb-4">
            <div className="pointer-events-auto mx-auto max-w-2xl">
              <AgentBar
                variant="dock"
                value={analysisInput}
                onChange={setAnalysisInput}
                onSubmit={handleAnalysis}
                messages={analysisMessages}
                placeholder="Filtrá, cambiá el bloque o pedí construir emails"
              />
            </div>
          </div>
          <AnimatePresence>
            {selected && (
              <Expediente
                company={selected}
                draft={drafts[selected.id]}
                onClose={goBack}
                onCreateOne={() => upsertDrafts([selected.id])}
                onCreateAll={() => {
                  upsertDrafts(filtered.map((c) => c.id))
                  navigate({ stage: "emails", selectedId: null })
                }}
                onViewEmails={() => navigate({ stage: "emails", selectedId: null })}
              />
            )}
          </AnimatePresence>
        </>
      )}

      {stage === "emails" && (
        <EmailDesk
          companies={lote}
          drafts={drafts}
          gaps={gaps}
          sendNote={sendNote}
          onBack={goBack}
          onReset={reset}
          onDashboard={() => navigate({ stage: "dashboard", selectedId: null })}
          onEditOne={(id, instruction) => {
            setDrafts((prev) => {
              const current = prev[id]
              if (!current) return prev
              return { ...prev, [id]: applyEdit(current, instruction) }
            })
          }}
          onEditAll={(instruction) => {
            setDrafts((prev) => {
              const next = { ...prev }
              for (const id of Object.keys(next)) {
                if (next[id].status !== "enviado") next[id] = applyEdit(next[id], instruction)
              }
              return next
            })
          }}
          onChangeDraft={(id, patch) => {
            setDrafts((prev) => {
              const current = prev[id]
              if (!current) return prev
              return { ...prev, [id]: { ...current, ...patch } }
            })
          }}
          onSendOne={(id) => {
            setDrafts((prev) => {
              const current = prev[id]
              if (!current) return prev
              return { ...prev, [id]: { ...current, status: "enviado" } }
            })
          }}
          onSendAll={() => {
            setDrafts((prev) => {
              const next = { ...prev }
              for (const id of Object.keys(next)) next[id] = { ...next[id], status: "enviado" }
              return next
            })
          }}
          onSchedule={handleSchedule}
        />
      )}

      {stage === "dashboard" && (
        <Dashboard
          gaps={gaps}
          drafted={Object.keys(drafts).length || lote.length}
          onBack={goBack}
        />
      )}
    </div>
  )
}
