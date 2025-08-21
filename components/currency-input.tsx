"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number
  onValueChange?: (value: number) => void
  label?: string
}

export function CurrencyInput({ value = 0, onValueChange, className, ...props }: CurrencyInputProps) {
  const [raw, setRaw] = useState<number>(value)

  useEffect(() => {
    setRaw(value)
  }, [value])

  const display = useMemo(() => {
    return (raw || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 })
  }, [raw])

  return (
    <Input
      inputMode="numeric"
      value={display}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "")
        const cents = Number(digits) / 100
        setRaw(cents)
        onValueChange?.(cents)
      }}
      className={cn("border-gray-700 bg-gray-900 text-white", className)}
      {...props}
    />
  )
}
