import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface DashboardStatsProps {
  title: string
  value: string
  description: string
  trend: "up" | "down" | "neutral"
}

export function DashboardStats({ title, value, description, trend }: DashboardStatsProps) {
  return (
    <Card className="bg-black border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          {trend === "up" && <ArrowUp className="h-4 w-4 text-green-500" />}
          {trend === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
          {trend === "neutral" && <ArrowRight className="h-4 w-4 text-gray-400" />}
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
