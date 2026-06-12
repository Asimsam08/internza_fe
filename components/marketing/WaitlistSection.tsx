"use client"

import * as React from "react"
import { Bell, CheckCircle2, Info, Mail, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProofAuraLogo } from "@/components/brand/ProofAuraLogo"
import { useJoinWaitlist } from "@/lib/hooks/use-waitlist"
import { ApiError } from "@/lib/api-client"
import { cn } from "@/lib/utils"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed) return "Email is required"
  if (!EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address"
  return null
}

function isDuplicateError(err: unknown): boolean {
  if (err instanceof ApiError) {
    return err.statusCode === 409 || err.message.toLowerCase().includes("already")
  }
  if (err instanceof Error) {
    return err.message.toLowerCase().includes("already")
  }
  return false
}

export function WaitlistSection({ className }: { className?: string }) {
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)
  const [alreadyOnList, setAlreadyOnList] = React.useState(false)
  const joinWaitlist = useJoinWaitlist()

  const resetFeedback = () => {
    setError(null)
    setAlreadyOnList(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateEmail(email)
    if (validationError) {
      setError(validationError)
      setAlreadyOnList(false)
      return
    }

    resetFeedback()

    try {
      await joinWaitlist.mutateAsync(email.trim())
      setSubmitted(true)
    } catch (err) {
      if (isDuplicateError(err)) {
        setAlreadyOnList(true)
        setError(null)
      } else {
        const message =
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        setError(message)
        setAlreadyOnList(false)
      }
    }
  }

  const showForm = !submitted && !alreadyOnList

  return (
    <section id="waitlist" className={cn("scroll-mt-20 bg-background", className)}>
      <div className="mx-auto max-w-7xl px-3 py-12 xs:px-4 xs:py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Gradient border frame — visually distinct from the solid navy CTA above */}
        <div className="relative rounded-2xl p-px shadow-[0_24px_80px_-20px_rgba(26,43,75,0.35)] xs:rounded-[1.75rem] sm:rounded-[2rem]">
          <div
            className="absolute inset-0 rounded-2xl opacity-90 xs:rounded-[1.75rem] sm:rounded-[2rem]"
            style={{
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.7) 0%, rgba(26,43,75,0.4) 40%, rgba(16,185,129,0.5) 70%, rgba(100,116,139,0.3) 100%)",
            }}
          />

          <div className="relative overflow-hidden rounded-[calc(1rem-1px)] bg-white xs:rounded-[calc(1.75rem-1px)] sm:rounded-[calc(2rem-1px)]">
            {/* Ambient decoration */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgb(226 232 240) 1px, transparent 0)",
                  backgroundSize: "28px 28px",
                }}
              />
            </div>

            <div className="relative grid gap-8 px-4 py-10 xs:gap-9 xs:px-5 xs:py-12 sm:gap-10 sm:px-8 sm:py-14 md:px-10 md:py-16 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14 lg:px-14">
              {/* Left — narrative */}
              <div className="text-center lg:text-left">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Early access
                </div>

                <div className="mb-6 flex justify-center lg:justify-start">
                  <div className="relative">
                    <div className="absolute inset-0 scale-125 rounded-full bg-accent/10 blur-xl" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary-100 bg-white shadow-sm ring-4 ring-accent/10">
                      <ProofAuraLogo variant="icon" className="h-9 w-9" />
                    </div>
                  </div>
                </div>

                <h2 className="font-display text-2xl font-extrabold tracking-tight text-primary xs:text-3xl sm:text-4xl">
                  Join the waitlist
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-secondary-600 xs:mt-4 xs:text-base lg:mx-0">
                  Receive all the latest news and updates, as well as early access to the beta.
                </p>

                <div className="mt-8 hidden flex-col gap-3 lg:flex">
                  {[
                    { icon: Bell, text: "Launch updates delivered to your inbox" },
                    { icon: CheckCircle2, text: "Priority access when we open the beta" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-3 text-sm font-semibold text-secondary-600"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — form / states */}
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="rounded-xl border border-secondary-100 bg-secondary-50/60 p-3.5 shadow-inner backdrop-blur-sm xs:rounded-2xl xs:p-4 sm:p-6 md:p-8">
                  {showForm && (
                    <div className="animate-in fade-in zoom-in-95 duration-400">
                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-2 min-[520px]:flex-row min-[520px]:items-stretch min-[520px]:gap-2.5 sm:gap-3"
                        noValidate
                      >
                        <div className="relative min-w-0 flex-1">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400 xs:left-3.5 min-[520px]:left-4" />
                          <Input
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value)
                              if (error || alreadyOnList) resetFeedback()
                            }}
                            disabled={joinWaitlist.isPending}
                            className={cn(
                              "h-11 rounded-lg border-secondary-200 bg-white pl-9 text-sm shadow-sm xs:h-11 xs:rounded-xl xs:pl-10 min-[520px]:h-12 min-[520px]:pl-11",
                              error &&
                                "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200"
                            )}
                            aria-invalid={!!error}
                            aria-describedby={error ? "waitlist-error" : undefined}
                          />
                        </div>
                        <Button
                          type="submit"
                          size="lg"
                          variant="gradient"
                          isLoading={joinWaitlist.isPending}
                          className="h-11 w-full shrink-0 rounded-lg px-5 text-sm font-bold shadow-md xs:rounded-xl min-[520px]:h-12 min-[520px]:w-auto min-[520px]:px-6 sm:px-8"
                        >
                          Join waitlist
                        </Button>
                      </form>

                      {error && (
                        <p
                          id="waitlist-error"
                          role="alert"
                          className="mt-3 text-sm font-medium text-red-600"
                        >
                          {error}
                        </p>
                      )}
                    </div>
                  )}

                  {submitted && (
                    <div
                      className="animate-in fade-in zoom-in-95 duration-500 text-center"
                      aria-live="polite"
                    >
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 ring-4 ring-accent/10">
                        <CheckCircle2 className="h-7 w-7 text-accent" />
                      </div>
                      <h3 className="font-display text-2xl font-extrabold text-primary">
                        Thank you!
                      </h3>
                      <p className="mt-2 text-sm text-secondary-600 sm:text-base">
                        You&apos;re on the list. We&apos;ll reach out at{" "}
                        <span className="font-semibold text-primary">{email.trim()}</span> when early
                        access opens.
                      </p>
                    </div>
                  )}

                  {alreadyOnList && (
                    <div
                      className="animate-in fade-in zoom-in-95 duration-500 text-center"
                      aria-live="polite"
                    >
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 ring-4 ring-amber-100">
                        <Info className="h-7 w-7 text-amber-600" />
                      </div>
                      <h3 className="font-display text-xl font-extrabold text-primary sm:text-2xl">
                        You&apos;re already on the waitlist
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-secondary-600 sm:text-base">
                        This email has already been added to our waitlist. We&apos;ll notify you at{" "}
                        <span className="font-semibold text-primary">{email.trim()}</span> as soon as
                        early access is ready — no need to sign up again.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setAlreadyOnList(false)
                          setEmail("")
                        }}
                        className="mt-5 text-sm font-semibold text-accent-700 transition-colors hover:text-accent-600"
                      >
                        Try a different email
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
