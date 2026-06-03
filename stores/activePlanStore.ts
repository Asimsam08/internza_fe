"use client"

import { useEffect, useState } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ActivePlanState {
  activePlanId: string | null
  setActivePlanId: (planId: string | null) => void
}

export const useActivePlanStore = create<ActivePlanState>()(
  persist(
    (set) => ({
      activePlanId: null,
      setActivePlanId: (planId) => set({ activePlanId: planId }),
    }),
    { name: "internza-active-plan-id" },
  ),
)

/** Wait for persisted active plan id before the first dashboard fetch. */
export function useActivePlanHydrated() {
  const [hydrated, setHydrated] = useState(() =>
    useActivePlanStore.persist.hasHydrated(),
  )

  useEffect(() => {
    const unsub = useActivePlanStore.persist.onFinishHydration(() => setHydrated(true))
    setHydrated(useActivePlanStore.persist.hasHydrated())
    return unsub
  }, [])

  return hydrated
}
