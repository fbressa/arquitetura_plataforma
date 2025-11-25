"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppContext } from '@/app/context/AppContext'

const publicRoutes = ['/login', '/signup']

export function useAuthGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, token } = useAppContext()

  useEffect(() => {
    const isPublicRoute = publicRoutes.includes(pathname)

    // Se está em rota pública e está autenticado, redirecionar para home
    if (isPublicRoute && isAuthenticated) {
      window.location.href = '/'
      return
    }

    // Se não está em rota pública e não está autenticado, redirecionar para login
    if (!isPublicRoute && !isAuthenticated) {
      window.location.href = '/login'
      return
    }
  }, [isAuthenticated, pathname, router, token])

  return { isAuthenticated }
}
