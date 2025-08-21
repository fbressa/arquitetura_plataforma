import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "Pendente" | "Aprovado" | "Rejeitado" | "Em análise"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const map: Record<StatusBadgeProps["status"], { bg: string; dot: string; text: string }> = {
    "Pendente": { bg: "bg-yellow-500/15", dot: "bg-yellow-400", text: "text-yellow-400" },
    "Aprovado": { bg: "bg-green-500/15", dot: "bg-green-400", text: "text-green-400" },
    "Rejeitado": { bg: "bg-red-500/15", dot: "bg-red-400", text: "text-red-400" },
    "Em análise": { bg: "bg-blue-500/15", dot: "bg-blue-400", text: "text-blue-400" },
  }
  const c = map[status]
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs", c.bg, c.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} aria-hidden="true" />
      {status}
    </span>
  )
}
