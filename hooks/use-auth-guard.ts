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
      router.push('/')
      return
    }

    // Se não está em rota pública e não está autenticado, redirecionar para login
    if (!isPublicRoute && !isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, pathname, router, token])

  return { isAuthenticated }
}
