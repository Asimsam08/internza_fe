"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type HeroTypewriterProps = {
  lines: string[]
  className?: string
  speed?: number
  pauseBetweenLines?: number
  gradientLineIndex?: number
}

export function HeroTypewriter({
  lines,
  className,
  speed = 42,
  pauseBetweenLines = 380,
  gradientLineIndex,
}: HeroTypewriterProps) {
  const [lineIndex, setLineIndex] = React.useState(0)
  const [charIndex, setCharIndex] = React.useState(0)
  const [isComplete, setIsComplete] = React.useState(false)

  const currentLine = lines[lineIndex] ?? ""
  const displayed = currentLine.slice(0, charIndex)

  React.useEffect(() => {
    if (isComplete) return

    if (charIndex < currentLine.length) {
      const timeout = window.setTimeout(() => setCharIndex((c) => c + 1), speed)
      return () => window.clearTimeout(timeout)
    }

    if (lineIndex < lines.length - 1) {
      const timeout = window.setTimeout(() => {
        setLineIndex((l) => l + 1)
        setCharIndex(0)
      }, pauseBetweenLines)
      return () => window.clearTimeout(timeout)
    }

    setIsComplete(true)
  }, [charIndex, currentLine.length, isComplete, lineIndex, lines.length, pauseBetweenLines, speed])

  return (
    <span className={cn("inline", className)} aria-label={lines.join(" ")}>
      {lines.map((line, i) => {
        if (i > lineIndex) return null

        const text = i < lineIndex ? line : i === lineIndex ? displayed : ""
        const isActiveLine = i === lineIndex && !isComplete

        const isGradientLine = gradientLineIndex === i

        return (
          <span
            key={line}
            className={cn("block", isGradientLine && text.length > 0 && "gradient-text-animated")}
          >
            {text}
            {isActiveLine ? (
              <span
                className="ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.08em] animate-pulse bg-accent align-middle"
                aria-hidden="true"
              />
            ) : null}
          </span>
        )
      })}
    </span>
  )
}
