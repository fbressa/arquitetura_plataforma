"use client"

import { useAppContext } from "@/app/context/AppContext"
import { ClientOnly } from "./client-only"

export function GlobalLoader() {
  const { isLoading } = useAppContext()

  return (
    <ClientOnly>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
            <p className="text-sm text-gray-300">Carregando...</p>
          </div>
        </div>
      )}
    </ClientOnly>
  )
}
