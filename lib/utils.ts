import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDateRelative(date: Date | string): string {
  const now = new Date()
  const target = new Date(date)
  const diffInDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 0) return "Overdue"
  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "Tomorrow"
  if (diffInDays <= 7) return `${diffInDays} days left`
  return `${Math.ceil(diffInDays / 7)} weeks left`
}
