"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { BarChart3, FileText, Download, Calendar, Filter } from 'lucide-react'
import { useAppContext } from "@/app/context/AppContext"
import { useSPANavigation } from "@/hooks/use-spa-navigation"
import { getRefundsReportRequest } from "@/lib/api"
import { RefundReport } from "@/lib/types/dashboard"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as XLSX from 'xlsx'

export default function RelatoriosPage() {
  const { addNotification } = useAppContext()
  const { navigate } = useSPANavigation()
  const [reports, setReports] = useState<RefundReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  useEffect(() => {
    loadReports()
  }, [statusFilter])

  const loadReports = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login', true)
        return
      }

      const status = statusFilter !== "all" ? statusFilter : undefined
      const data = await getRefundsReportRequest(token, status)
      setReports(data)
      setLoading(false)
    } catch (error: any) {
      addNotification({ type: 'error', message: error.message || 'Erro ao carregar relatórios' })
      setLoading(false)
    }
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      PENDING: 'Pendente',
      APPROVED: 'Aprovado',
      REJECTED: 'Rejeitado'
    }
    return labels[status as keyof typeof labels] || status
  }

  const handleExport = () => {
    exportToExcel(filteredReports)
    addNotification({ type: 'success', message: 'Relatório Excel exportado com sucesso!' })
  }

  const exportToExcel = (data: RefundReport[]) => {
    // Preparar os dados para o Excel
    const excelData = data.map(report => ({
      'ID': report.id,
      'Descrição': report.description,
      'Valor (R$)': report.amount,
      'Status': getStatusLabel(report.status),
      'Data de Criação': new Date(report.createdAt).toLocaleDateString('pt-BR'),
      'Dias desde Criação': report.daysSinceCreation,
      'Última Atualização': new Date(report.updatedAt).toLocaleDateString('pt-BR')
    }))

    // Criar uma nova planilha
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    
    // Definir largura das colunas
    const columnWidths = [
      { wch: 38 }, // ID
      { wch: 40 }, // Descrição
      { wch: 15 }, // Valor
      { wch: 15 }, // Status
      { wch: 18 }, // Data de Criação
      { wch: 20 }, // Dias desde Criação
      { wch: 20 }  // Última Atualização
    ]
    worksheet['!cols'] = columnWidths

    // Criar um novo workbook e adicionar a planilha
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reembolsos')

    // Gerar o arquivo Excel e fazer download
    const timestamp = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `relatorio-reembolsos-${timestamp}.xlsx`)
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
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

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      PENDING: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
      APPROVED: 'bg-green-500/15 text-green-400 border-green-500/20',
      REJECTED: 'bg-red-500/15 text-red-400 border-red-500/20'
    }
    return classes[status as keyof typeof classes] || ''
  }

  const totalAmount = filteredReports.reduce((sum, r) => sum + r.amount, 0)
  const avgAmount = filteredReports.length > 0 ? totalAmount / filteredReports.length : 0

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Carregando relatórios...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Relatórios de Reembolsos"
        description="Analise e exporte dados de reembolsos"
        actions={
          <div className="flex gap-2">
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleExport}
              disabled={filteredReports.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Relatórios" }]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Registros</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{filteredReports.length}</div>
            <p className="mt-1 text-xs text-gray-400">
              Reembolsos no relatório
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Valor Total</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{formatCurrency(totalAmount)}</div>
            <p className="mt-1 text-xs text-gray-400">
              Soma de todos os valores
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Valor Médio</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{formatCurrency(avgAmount)}</div>
            <p className="mt-1 text-xs text-gray-400">
              Por reembolso
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Status Atual</CardTitle>
              <Download className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">
              {statusFilter === 'all' ? 'Todos' : getStatusLabel(statusFilter.toUpperCase())}
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Filtro aplicado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-800 bg-black">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Dados de Reembolsos</CardTitle>
              <Button 
                variant="outline"
                className="border-gray-800 text-gray-300 hover:bg-gray-950"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </Button>
            </div>
            
            {showFilters && (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-gray-300">Buscar</Label>
                  <Input
                    id="search"
                    placeholder="ID ou descrição..."
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-300">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-gray-800 bg-gray-950 text-white">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-800 bg-black text-gray-200">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="approved">Aprovados</SelectItem>
                      <SelectItem value="rejected">Rejeitados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline"
                    className="w-full border-gray-800 text-gray-300 hover:bg-gray-950"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">ID</TableHead>
                <TableHead className="text-gray-300">Descrição</TableHead>
                <TableHead className="text-gray-300">Valor</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Data</TableHead>
                <TableHead className="text-gray-300">Dias desde Criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                    Carregando dados...
                  </TableCell>
                </TableRow>
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id} className="border-gray-800 hover:bg-gray-900">
                    <TableCell className="text-white font-mono">#{report.id}</TableCell>
                    <TableCell className="text-white">{report.description}</TableCell>
                    <TableCell className="text-white">{formatCurrency(report.amount)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={getStatusBadgeClass(report.status)}
                      >
                        {getStatusLabel(report.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{formatDate(report.createdAt)}</TableCell>
                    <TableCell className="text-gray-300">{report.daysSinceCreation} dias</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
