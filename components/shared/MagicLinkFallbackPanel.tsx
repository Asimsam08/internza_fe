"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Mail,
  MailX,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface MagicLinkItem {
  email: string
  name?: string
  inviteUrl: string
  emailSent: boolean
  /** e.g. "Reviewer", "Student" */
  roleLabel?: string
  note?: string
}

export interface MagicLinkFallbackPanelProps {
  items: MagicLinkItem[]
  title?: string
  description?: string
  /** Start expanded when any email failed */
  autoExpandOnFailure?: boolean
  className?: string
}

export function MagicLinkFallbackPanel({
  items,
  title = "Invite links",
  description = "Share these secure links if email did not arrive. Each link expires in 7 days.",
  autoExpandOnFailure = true,
  className,
}: MagicLinkFallbackPanelProps) {
  const anyFailed = items.some((i) => !i.emailSent)
  const allSent = items.length > 0 && items.every((i) => i.emailSent)
  const [expanded, setExpanded] = useState(autoExpandOnFailure && anyFailed)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  if (!items.length) return null

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const copyAll = () => {
    const text = items
      .map((i) => {
        const who = i.name ? `${i.name} <${i.email}>` : i.email
        const role = i.roleLabel ? ` (${i.roleLabel})` : ""
        return `${who}${role}\n${i.inviteUrl}${i.note ? `\nNote: ${i.note}` : ""}`
      })
      .join("\n\n")
    copy(text, "__all__")
  }

  return (
    <section
      className={cn(
        "rounded-lg border text-sm",
        anyFailed ? "border-amber-200 bg-amber-50/80" : "border-secondary-200 bg-secondary-50/50",
        className,
      )}
    >
      <header className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="font-semibold text-secondary-900 flex items-center gap-2">
              {anyFailed ? (
                <MailX className="h-4 w-4 shrink-0 text-amber-700" />
              ) : allSent ? (
                <Mail className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : null}
              {title}
            </p>
            <p className="text-xs text-secondary-600">{description}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 h-8"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1" />
                Hide links
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1" />
                Show links
              </>
            )}
          </Button>
        </div>

        {anyFailed ? (
          <p className="text-xs text-amber-800 flex items-start gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            One or more emails could not be sent. Copy the links below and share them on WhatsApp or your college email.
          </p>
        ) : allSent ? (
          <p className="text-xs text-emerald-800">
            Email sent successfully. You can still open the links below if someone did not receive the message.
          </p>
        ) : null}
      </header>

      {expanded ? (
        <div className="px-4 pb-4 space-y-3 border-t border-secondary-200/80 pt-3">
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => {
              const key = item.email
              return (
                <li
                  key={key}
                  className="rounded-md border bg-white p-3 space-y-2 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      {item.name ? (
                        <p className="font-medium text-secondary-900 truncate">{item.name}</p>
                      ) : null}
                      <p className="text-xs font-mono text-secondary-600 truncate">{item.email}</p>
                      {item.roleLabel ? (
                        <span className="text-[10px] uppercase tracking-wide text-secondary-500">
                          {item.roleLabel}
                        </span>
                      ) : null}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0",
                        item.emailSent
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-900",
                      )}
                    >
                      {item.emailSent ? "Email sent" : "Email not sent"}
                    </span>
                  </div>
                  {item.note ? (
                    <p className="text-xs text-secondary-500">{item.note}</p>
                  ) : null}
                  <div className="flex gap-1">
                    <Input
                      readOnly
                      value={item.inviteUrl}
                      className="h-8 text-xs font-mono bg-secondary-50"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 shrink-0"
                      title="Copy link"
                      onClick={() => copy(item.inviteUrl, key)}
                    >
                      {copiedKey === key ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 shrink-0"
                      title="Open link"
                      asChild
                    >
                      <a href={item.inviteUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
          <Button type="button" variant="secondary" size="sm" onClick={copyAll}>
            {copiedKey === "__all__" ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1" /> Copied all
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1" /> Copy all links
              </>
            )}
          </Button>
        </div>
      ) : null}
    </section>
  )
}
