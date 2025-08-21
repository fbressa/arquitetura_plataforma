"use client"

// Componentes para a interface de relatórios e análises
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
// Ícones relacionados a dados, arquivos e análises
import { ArrowUp, ArrowDown, BarChart3, FileText, Download, Calendar } from 'lucide-react'

export default function RelatoriosPage() {
  return (
    // Estrutura padrão com navegação e layout consistente
    <DashboardLayout>
      {/* Cabeçalho da seção de relatórios e análises */}
      <PageHeader
        title="Relatórios"
        description="Analise dados e gere relatórios do sistema"
        actions={
          <div className="flex gap-2">
            <Button className="bg-orange-500 hover:bg-orange-600">Novo Relatório</Button>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Relatórios" }]}
      />

      {/* Métricas sobre a atividade de relatórios - uso e estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Relatórios Hoje</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">23</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +5 desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Downloads</CardTitle>
              <Download className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">156</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +18% este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Relatórios Agendados</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">8</div>
            <p className="mt-1 flex items-center text-xs text-blue-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              Próximos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Relatórios Salvos</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">342</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +24 este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Centro de relatórios - aqui ficam todos os documentos gerados */}
      <Card className="border-gray-800 bg-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Relatórios Disponíveis</CardTitle>
            {/* Sistema de busca para localizar relatórios específicos */}
            <div className="flex gap-2">
              <Input
                placeholder="Buscar relatórios..."
                className="w-64 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
              <Button className="bg-orange-500 hover:bg-orange-600">
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tabela com informações detalhadas de cada relatório */}
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">Nome do Relatório</TableHead>
                <TableHead className="text-gray-300">Tipo</TableHead>
                <TableHead className="text-gray-300">Período</TableHead>
                <TableHead className="text-gray-300">Última Atualização</TableHead>
                <TableHead className="text-gray-300">Tamanho</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Lista de relatórios disponíveis com seus metadados */}
              {/* Lista dinâmica de relatórios com dados mockados para demonstração */}
              {[
                { nome: "Vendas Mensais", tipo: "Vendas", periodo: "Mensal", atualizacao: "Hoje, 09:30", tamanho: "2.3 MB", status: "Disponível" },
                { nome: "Estoque Detalhado", tipo: "Estoque", periodo: "Semanal", atualizacao: "Ontem, 18:45", tamanho: "1.8 MB", status: "Disponível" },
                { nome: "Clientes Ativos", tipo: "Clientes", periodo: "Mensal", atualizacao: "Hoje, 14:20", tamanho: "945 KB", status: "Disponível" },
                { nome: "Reembolsos Pendentes", tipo: "Financeiro", periodo: "Diário", atualizacao: "Hoje, 16:15", tamanho: "567 KB", status: "Processando" },
                { nome: "Performance de Vendas", tipo: "Análise", periodo: "Trimestral", atualizacao: "2 dias atrás", tamanho: "4.1 MB", status: "Disponível" },
                { nome: "Produtos Mais Vendidos", tipo: "Estoque", periodo: "Mensal", atualizacao: "Hoje, 11:00", tamanho: "1.2 MB", status: "Disponível" },
                { nome: "Fluxo de Caixa", tipo: "Financeiro", periodo: "Mensal", atualizacao: "Processando...", tamanho: "-", status: "Processando" },
              ].map((relatorio, index) => (
                <TableRow key={index} className="border-gray-800 hover:bg-gray-900">
                  <TableCell className="text-white font-medium">{relatorio.nome}</TableCell>
                  <TableCell className="text-gray-300">{relatorio.tipo}</TableCell>
                  <TableCell className="text-gray-300">{relatorio.periodo}</TableCell>
                  <TableCell className="text-gray-300">{relatorio.atualizacao}</TableCell>
                  <TableCell className="text-white">{relatorio.tamanho}</TableCell>
                  <TableCell>
                    {/* Badge visual para indicar status do relatório */}
                    <Badge 
                      className={
                        relatorio.status === "Disponível" 
                          ? "bg-green-500/15 text-green-400 border-green-500/20" 
                          : relatorio.status === "Processando"
                          ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                          : "bg-red-500/15 text-red-400 border-red-500/20"
                      }
                    >
                      {relatorio.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* Botões de ação dependendo do status do relatório */}
                    <div className="flex gap-2">
                      {relatorio.status === "Disponível" ? (
                        <>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            Ver
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" className="border-gray-700 text-gray-500" disabled>
                          Aguardar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
