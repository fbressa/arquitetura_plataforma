"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Check, X, Eye, Calendar, User, DollarSign } from 'lucide-react'
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { useAppContext } from "@/app/context/AppContext"
import { useSPANavigation } from "@/hooks/use-spa-navigation"
import { getRefundsRequest, updateRefundRequest } from "@/lib/api"
import { Refund } from "@/lib/types/refund"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function ReembolsosPage() {
  const { addNotification, userInfo } = useAppContext()
  const { navigate } = useSPANavigation()
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("todas")
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  useEffect(() => {
    loadRefunds()
  }, [])

  const loadRefunds = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login', true)
        return
      }

      const data = await getRefundsRequest(token)
      setRefunds(data)
      setLoading(false)
    } catch (error: any) {
      addNotification({ type: 'error', message: error.message || 'Erro ao carregar reembolsos' })
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (refundId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login', true)
        return
      }

      await updateRefundRequest(token, refundId, { status })
      addNotification({ 
        type: 'success', 
        message: `Reembolso ${status === 'APPROVED' ? 'aprovado' : 'rejeitado'} com sucesso!` 
      })
      loadRefunds()
    } catch (error: any) {
      addNotification({ type: 'error', message: error.message || 'Erro ao atualizar reembolso' })
    }
  }

  const filteredRefunds = refunds.filter(refund => {
    const matchesSearch = 
      refund.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (refund.user?.name && refund.user.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTab = 
      activeTab === "todas" ||
      (activeTab === "pendentes" && refund.status === "PENDING") ||
      (activeTab === "aprovadas" && refund.status === "APPROVED") ||
      (activeTab === "rejeitadas" && refund.status === "REJECTED")

    return matchesSearch && matchesTab
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      PENDING: 'Pendente',
      APPROVED: 'Aprovado',
      REJECTED: 'Rejeitado'
    }
    return labels[status as keyof typeof labels] || status
  }

  const handleViewDetails = (refund: Refund) => {
    setSelectedRefund(refund)
    setIsDetailDialogOpen(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Carregando reembolsos...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Reembolsos"
        description="Gerencie solicitações de reembolso de despesas"
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Reembolsos" }]}
        actions={
          <div className="flex gap-2">
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/reembolsos/novo">
                <Plus className="mr-2 h-4 w-4" />
                Nova Solicitação
              </Link>
            </Button>
          </div>
        }
      />

      <Card className="border-gray-800 bg-black">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-1 items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-2 py-1">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por funcionário ou descrição..."
                className="h-8 border-0 bg-transparent text-sm placeholder:text-gray-500 focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-gray-950">
                {[
                  { v: "todas", l: "Todas", count: refunds.length },
                  { v: "pendentes", l: "Pendentes", count: refunds.filter(r => r.status === "PENDING").length },
                  { v: "aprovadas", l: "Aprovadas", count: refunds.filter(r => r.status === "APPROVED").length },
                  { v: "rejeitadas", l: "Rejeitadas", count: refunds.filter(r => r.status === "REJECTED").length },
                ].map((t) => (
                  <TabsTrigger
                    key={t.v}
                    value={t.v}
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    {t.l} ({t.count})
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <div className="rounded-lg border border-gray-800">
                  <div className="max-h-[480px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 z-10 bg-black">
                        <TableRow className="border-gray-800">
                          <TableHead className="text-gray-300">Funcionário</TableHead>
                          <TableHead className="text-gray-300">Descrição</TableHead>
                          <TableHead className="text-gray-300">Valor</TableHead>
                          <TableHead className="text-gray-300">Data</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRefunds.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                              {searchTerm ? 'Nenhum reembolso encontrado' : 'Nenhum reembolso cadastrado'}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRefunds.map((refund, idx) => (
                            <TableRow
                              key={refund.id}
                              className={`border-gray-800 hover:bg-gray-950 ${idx % 2 === 0 ? "bg-black" : "bg-gray-950/60"}`}
                            >
                              <TableCell className="text-white">
                                {refund.user?.name || 'Usuário não encontrado'}
                              </TableCell>
                              <TableCell className="text-white">{refund.description}</TableCell>
                              <TableCell className="text-white font-medium">{formatCurrency(refund.amount)}</TableCell>
                              <TableCell className="text-white">{formatDate(refund.createdAt)}</TableCell>
                              <TableCell className="text-white">
                                <StatusBadge status={getStatusLabel(refund.status) as any} />
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                                    onClick={() => handleViewDetails(refund)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Ver
                                  </Button>
                                  {refund.status === "PENDING" && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        className="bg-green-600 text-white hover:bg-green-700"
                                        onClick={() => handleUpdateStatus(refund.id, 'APPROVED')}
                                      >
                                        <Check className="h-3 w-3 mr-1" />
                                        Aprovar
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        className="bg-red-600 text-white hover:bg-red-700"
                                        onClick={() => handleUpdateStatus(refund.id, 'REJECTED')}
                                      >
                                        <X className="h-3 w-3 mr-1" />
                                        Rejeitar
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-800 bg-black px-3 py-2 text-sm text-gray-400">
                    <span>Total: {filteredRefunds.length} reembolso(s)</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes do Reembolso */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Detalhes do Reembolso</DialogTitle>
            <DialogDescription className="text-gray-400">
              Informações completas sobre a solicitação de reembolso
            </DialogDescription>
          </DialogHeader>
          
          {selectedRefund && (
            <div className="space-y-6 py-4">
              {/* ID e Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-400 text-sm">ID da Solicitação</Label>
                  <p className="text-white font-mono text-xs bg-gray-950 p-2 rounded border border-gray-800">
                    {selectedRefund.id}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-sm">Status</Label>
                  <div className="flex items-center h-full">
                    <StatusBadge status={getStatusLabel(selectedRefund.status) as any} />
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label className="text-gray-400 text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Descrição
                </Label>
                <p className="text-white bg-gray-950 p-3 rounded border border-gray-800">
                  {selectedRefund.description}
                </p>
              </div>

              {/* Valor */}
              <div className="space-y-2">
                <Label className="text-gray-400 text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Valor
                </Label>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(selectedRefund.amount)}
                </p>
              </div>

              {/* Funcionário */}
              <div className="space-y-2">
                <Label className="text-gray-400 text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Funcionário
                </Label>
                <p className="text-white bg-gray-950 p-3 rounded border border-gray-800">
                  {selectedRefund.user?.name || 'Usuário não encontrado'}
                  <span className="text-gray-500 ml-2">({selectedRefund.user?.email || 'N/A'})</span>
                </p>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-400 text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data de Criação
                  </Label>
                  <p className="text-white bg-gray-950 p-3 rounded border border-gray-800">
                    {formatDate(selectedRefund.createdAt)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Última Atualização
                  </Label>
                  <p className="text-white bg-gray-950 p-3 rounded border border-gray-800">
                    {formatDate(selectedRefund.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Ações no Dialog */}
              {selectedRefund.status === "PENDING" && (
                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleUpdateStatus(selectedRefund.id, 'APPROVED')
                      setIsDetailDialogOpen(false)
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Aprovar Reembolso
                  </Button>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      handleUpdateStatus(selectedRefund.id, 'REJECTED')
                      setIsDetailDialogOpen(false)
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rejeitar Reembolso
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
