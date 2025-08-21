"use client"

import { Menu, Search, Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AppTopbarProps {
  onOpenSidebar?: () => void
}

export function AppTopbar({ onOpenSidebar }: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:text-white hover:bg-gray-900 lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="ml-1 hidden w-full max-w-md items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-2 py-1 text-gray-200 ring-1 ring-transparent focus-within:ring-orange-500/40 lg:flex">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar (Ctrl + K)"
            className="h-8 border-0 bg-transparent text-sm placeholder:text-gray-500 focus-visible:ring-0"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-900"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-2 py-1 text-left text-sm text-gray-200 hover:bg-gray-900">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/diverse-user-avatars.png" alt="Usuário" />
                  <AvatarFallback className="bg-orange-500">JS</AvatarFallback>
                </Avatar>
                <span className="hidden md:block">João Silva</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 border-gray-800 bg-black text-gray-200">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="focus:bg-gray-900">Perfil</DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-gray-900">Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-400 focus:bg-red-500/10">Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
