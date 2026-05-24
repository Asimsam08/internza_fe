"use client"

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
