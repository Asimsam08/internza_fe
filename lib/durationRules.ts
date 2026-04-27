import { DurationRule, DurationType, PlanOption } from "./types"

// Duration Rules Engine - Config-driven system
// This defines all valid combinations for each duration type
export const DURATION_RULES: Record<DurationType, DurationRule> = {
  "4_weeks": {
    durationType: "4_weeks",
    totalWeeks: 4,
    allowedCombinations: [[4]],
    description: "Single 4-week project for focused skill building",
  },
  "8_weeks": {
    durationType: "8_weeks",
    totalWeeks: 8,
    allowedCombinations: [[8], [4, 4]],
    description: "Either one 8-week project or two 4-week projects",
  },
  "12_weeks": {
    durationType: "12_weeks",
    totalWeeks: 12,
    allowedCombinations: [[12], [8, 4], [4, 8], [4, 4, 4]],
    description: "One 12-week project, or 8+4, 4+8, or three 4-week projects",
  },
  "custom": {
    durationType: "custom",
    totalWeeks: 0, // User-defined
    allowedCombinations: [], // Dynamic based on user input
    description: "Custom duration with system-validated combinations",
  },
}

// Validate if a combination is allowed for a given duration
export function isValidCombination(
  durationType: DurationType,
  combination: number[],
  customWeeks?: number
): boolean {
  const rule = DURATION_RULES[durationType]

  if (durationType === "custom" && customWeeks) {
    // For custom, validate that the total matches the requested weeks
    const totalWeeks = combination.reduce((sum: number, weeks: number) => sum + weeks, 0)
    return totalWeeks === customWeeks && combination.every((w: number) => [4, 8, 12].includes(w))
  }

  return rule.allowedCombinations.some(
    (allowedCombination: number[]) => allowedCombination.length === combination.length &&
    allowedCombination.every((weeks: number, index: number) => weeks === combination[index])
  )
}

// Get valid plan options for a duration
export function getPlanOptions(
  durationType: DurationType,
  availableProjects: Array<{ id: string; title: string; duration: number }>,
  customWeeks?: number
): PlanOption[] {
  const rule = DURATION_RULES[durationType]
  const options: PlanOption[] = []

  if (durationType === "custom" && customWeeks) {
    // Generate options for custom duration
    const validCombinations = generateValidCombinations(customWeeks)
    validCombinations.forEach((combination, index) => {
      options.push(createPlanOption(combination, availableProjects, index, true, durationType))
    })
  } else {
    // Use pre-defined combinations
    rule.allowedCombinations.forEach((combination, index) => {
      options.push(createPlanOption(combination, availableProjects, index, false, durationType))
    })
  }

  return options
}

// Generate valid combinations for custom duration
function generateValidCombinations(totalWeeks: number): number[][] {
  const combinations: number[][] = []
  const blockSizes = [4, 8, 12]

  // Simple combinations for MVP
  if (totalWeeks === 4) combinations.push([4])
  if (totalWeeks === 8) combinations.push([8], [4, 4])
  if (totalWeeks === 12) combinations.push([12], [8, 4], [4, 8], [4, 4, 4])

  // For other custom values, try to find valid combinations
  if (![4, 8, 12].includes(totalWeeks)) {
    // For MVP, only support combinations that exactly match
    // Future: Add more sophisticated combination generation
  }

  return combinations
}

// Create a plan option from a combination
function createPlanOption(
  combination: number[],
  availableProjects: Array<{ id: string; title: string; duration: number }>,
  index: number,
  isCustom: boolean,
  durationType?: DurationType
): PlanOption {
  const blocks = combination.map((duration, blockIndex) => {
    // Find a matching project for this duration
    const matchingProject = availableProjects.find(p => p.duration === duration)
    return {
      id: `block-${index}-${blockIndex}`,
      projectId: matchingProject?.id || `project-${duration}`,
      projectTitle: matchingProject?.title || `${duration}-week Project`,
      duration,
      order: blockIndex + 1,
    }
  })

  const totalWeeks = combination.reduce((sum: number, weeks: number) => sum + weeks, 0)

  return {
    id: `plan-${isCustom ? 'custom' : durationType || 'unknown'}-${index}`,
    combination,
    blocks,
    totalWeeks,
    description: generateDescription(combination),
    recommended: index === 0, // First option is recommended
  }
}

// Generate human-readable description for a plan
function generateDescription(combination: number[]): string {
  if (combination.length === 1) {
    return `${combination[0]}-week project`
  }
  if (combination.length === 2) {
    return `${combination[0]}-week + ${combination[1]}-week projects`
  }
  return `${combination.length} projects (${combination.join(' + ')} weeks)`
}

// Check certificate eligibility
export function checkCertificateEligibility(
  completedWeeks: number,
  requiredWeeks: number,
  allBlocksApproved: boolean
): { isEligible: boolean; reason?: string } {
  if (completedWeeks < requiredWeeks) {
    return {
      isEligible: false,
      reason: `Complete ${requiredWeeks - completedWeeks} more week${requiredWeeks - completedWeeks > 1 ? 's' : ''}`,
    }
  }

  if (!allBlocksApproved) {
    return {
      isEligible: false,
      reason: "All project blocks must be approved",
    }
  }

  return { isEligible: true }
}

// Get recommended plan for a duration
export function getRecommendedPlan(
  durationType: DurationType,
  availableProjects: Array<{ id: string; title: string; duration: number }>
): PlanOption | null {
  const options = getPlanOptions(durationType, availableProjects)
  return options.find(opt => opt.recommended) || options[0] || null
}
