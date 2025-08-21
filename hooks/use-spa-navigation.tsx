"use client"

import { useRouter } from "next/navigation"
import { useAppContext } from "@/app/context/AppContext"

export function useSPANavigation() {
  const router = useRouter()
  const { setIsLoading, addNotification } = useAppContext()

  const navigateWithLoading = async (path: string, showNotification = false) => {
    try {
      setIsLoading(true)
      
      // Simula um pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 300))
      
      router.push(path)
      
      if (showNotification) {
        addNotification({
          type: "info",
          message: `Navegando para ${path}`
        })
      }
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erro ao navegar"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    router.back()
    addNotification({
      type: "info", 
      message: "Voltando à página anterior"
    })
  }

  const goForward = () => {
    router.forward()
  }

  const refresh = () => {
    router.refresh()
    addNotification({
      type: "info",
      message: "Página atualizada"
    })
  }

  return {
    navigate: navigateWithLoading,
    goBack,
    goForward,
    refresh,
    router
  }
}

/**
 * Hook para navegação SPA usando Next.js App Router.
 * Retorna função para navegação client-side, mantendo padrão SPA.
 */
export function useSpaNavigation() {
  const router = useRouter()

  /**
   * Navega para uma rota usando client-side navigation (SPA).
   * @param path Caminho de destino
   */
  function navigate(path: string) {
    router.push(path)
  }

  return { navigate }
}
