"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Building2, LayoutDashboard, Package, Receipt, ShoppingCart, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useState } from "react"

type NavItem = {
  name: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Reembolsos", href: "/reembolsos", icon: Receipt },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Membros", href: "/membros", icon: Users },
]

interface AppSidebarProps {
  initialCollapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export function AppSidebar({ initialCollapsed = false, onToggle }: AppSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(initialCollapsed)

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    onToggle?.(next)
  }

  return (
    <aside
      className={cn(
        "group relative h-screen border-r border-gray-800 bg-black transition-[width] duration-200",
        collapsed ? "w-[76px]" : "w-64",
      )}
      aria-label="Barra lateral de navegação"
    >
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-lg bg-orange-500/20 blur-md" aria-hidden="true" />
            <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-lg"/>
        </div>
        <span className={cn("truncate text-lg font-semibold text-white tracking-wide", collapsed && "hidden")}>
          Engnet Plataforma
        </span>
      </div>

      <TooltipProvider delayDuration={200}>
        <nav className="mt-2 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            const linkEl = (
              <div
                className={cn(
                  "group/item relative flex items-center rounded-md px-2 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_0_0_1px_#ea580c_inset]"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white",
                )}
              >
                {/* Indicador ativo à esquerda */}
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded bg-orange-500 opacity-0 transition-opacity",
                    isActive && "opacity-100",
                  )}
                  aria-hidden="true"
                />
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className={cn("truncate", collapsed && "hidden")}>{item.name}</span>
              </div>
            )
            return (
              <Link key={item.name} href={item.href} aria-current={isActive ? "page" : undefined}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-black text-gray-200 border-gray-800">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  linkEl
                )}
              </Link>
            )
          })}
        </nav>
      </TooltipProvider>

      <div className="absolute bottom-3 left-0 right-0 px-2">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-full border-gray-800 bg-gray-950 text-gray-300 hover:bg-gray-900 hover:text-white",
            collapsed && "justify-center",
          )}
          onClick={toggle}
          aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className={cn("ml-2", collapsed && "hidden")}>{collapsed ? "Expandir" : "Recolher"}</span>
        </Button>
      </div>
    </aside>
  )
}
