import type { Stage } from "../types"

export type Route = {
  stage: Stage
  selectedId: string | null
  chatOpen?: boolean
}

export function sameRoute(a: Route, b: Route) {
  return a.stage === b.stage && a.selectedId === b.selectedId
}

export function hashFor(route: Route) {
  if (route.stage === "landing") return "#/"
  if (route.stage === "emails") return "#/emails"
  if (route.stage === "dashboard") return "#/dashboard"
  if (route.selectedId) return `#/lote/${route.selectedId}`
  return "#/lote"
}
