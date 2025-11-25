"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, DollarSign, Package, Receipt, Users } from 'lucide-react'
import { PageHeader } from "@/components/page-header"
import { useAppContext } from "@/app/context/AppContext"
import { useSPANavigation } from "@/hooks/use-spa-navigation"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { getDashboardSummaryRequest, getRefundsReportRequest } from "@/lib/api"
import { DashboardSummary, RefundReport } from "@/lib/types/dashboard"

export default function Dashboard() {
  const { addNotification, userInfo, token } = useAppContext()
  const { navigate } = useSPANavigation()
  const { isAuthenticated } = useAuthGuard()
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null)
  const [recentRefunds, setRecentRefunds] = useState<RefundReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && token) {
      loadDashboardData()
    } else if (!isAuthenticated) {
      setLoading(false)
    }
  }, [isAuthenticated, token])

  const loadDashboardData = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const [summary, refunds] = await Promise.all([
        getDashboardSummaryRequest(token),
        getRefundsReportRequest(token)
      ])

      setDashboardData(summary)
      setRecentRefunds(refunds.slice(0, 3)) // Pega os 3 mais recentes
      setLoading(false)
    } catch (error: any) {
      addNotification({ type: 'error', message: error.message || 'Erro ao carregar dashboard' })
      setLoading(false)
    }
  }

  const handleNavigateToReports = () => {
    navigate("/reembolsos", true)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    } else if (diffDays === 1) {
      return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: { label: 'Pendente', class: 'text-yellow-400 bg-yellow-500/15' },
      APPROVED: { label: 'Aprovado', class: 'text-green-400 bg-green-500/15' },
      REJECTED: { label: 'Rejeitado', class: 'text-red-400 bg-red-500/15' }
    }
    return configs[status as keyof typeof configs] || configs.PENDING
  }

  // Não renderizar nada se não estiver autenticado (aguardando redirecionamento)
  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Carregando dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Visão geral do desempenho da empresa"
        actions={
          <div className="flex gap-2">
            <span className="text-white">Olá, {userInfo?.name || 'Visitante'}</span>
            <Button className="bg-orange-500 hover:bg-orange-600">Nova Transação</Button>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Dashboard" }]}
      />

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{formatCurrency(dashboardData?.refunds.totalAmount || 0)}</div>
            <p className="mt-1 flex items-center text-xs text-gray-400">
              {dashboardData?.refunds.totalRefunds || 0} reembolsos
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Reembolsos Pendentes</CardTitle>
              <Receipt className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{dashboardData?.refunds.byStatus.pending || 0}</div>
            <p className="mt-1 flex items-center text-xs text-yellow-400">
              Aguardando aprovação
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Membros Ativos</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{dashboardData?.users.activeUsers || 0}</div>
            <p className="mt-1 flex items-center text-xs text-gray-400">
              de {dashboardData?.users.totalUsers || 0} total
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Contratos Fechados</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{dashboardData?.clients.closedContracts || 0}</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              Clientes com CNPJ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seções */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Reembolsos Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentRefunds.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Nenhum reembolso encontrado</p>
              </div>
            ) : (
              recentRefunds.map((refund) => {
                const statusConfig = getStatusConfig(refund.status)
                return (
                  <div key={refund.id} className="flex items-center justify-between rounded-lg bg-gray-950 p-3">
                    <div>
                      <p className="font-medium text-white">{refund.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(refund.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">{formatCurrency(refund.amount)}</p>
                      <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${statusConfig.class}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-orange-500 text-white hover:bg-orange-600" asChild>
              <a href="/reembolsos/novo">Solicitar Reembolso</a>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-800 text-gray-300 hover:bg-gray-950"
              asChild
            >
              <a href="/vendas">Nova Venda</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
