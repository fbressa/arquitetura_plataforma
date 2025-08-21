"use client"

// Importações dos componentes principais para a interface
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
// Ícones específicos para a tela de estoque - cada um representa uma métrica diferente
import { ArrowUp, ArrowDown, Package, AlertTriangle, Truck, TrendingUp } from 'lucide-react'

export default function EstoquePage() {
  return (
    // Layout padrão que inclui sidebar e estrutura geral da aplicação
    <DashboardLayout>
      {/* Cabeçalho da página com título, descrição e botão principal */}
      <PageHeader
        title="Estoque"
        description="Gerencie e monitore o estoque de produtos"
        actions={
          <div className="flex gap-2">
            <Button className="bg-orange-500 hover:bg-orange-600">Adicionar Produto</Button>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Estoque" }]}
      />

      {/* Seção dos indicadores principais - resumo visual dos dados importantes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Card 1: Quantidade total de produtos no sistema */}
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">1.234</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +15 novos produtos
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Produtos que precisam de reposição urgente */}
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Estoque Baixo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">32</div>
            <p className="mt-1 flex items-center text-xs text-red-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +5 desde ontem
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Valor monetário total do inventário */}
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Valor Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">R$ 89.420,00</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +7% este mês
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Produtos em trânsito - chegando nos próximos dias */}
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Produtos Chegando</CardTitle>
              <Truck className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">8</div>
            <p className="mt-1 flex items-center text-xs text-blue-400">
              <ArrowDown className="mr-1 h-3 w-3" />
              Esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela principal com todos os produtos - aqui fica o coração da gestão */}
      <Card className="border-gray-800 bg-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Produtos em Estoque</CardTitle>
            {/* Barra de pesquisa e filtros para facilitar a localização de produtos */}
            <div className="flex gap-2">
              <Input
                placeholder="Buscar produtos..."
                className="w-64 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
              <Button className="bg-orange-500 hover:bg-orange-600">
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Cabeçalho da tabela com todas as colunas importantes */}
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">Código</TableHead>
                <TableHead className="text-gray-300">Produto</TableHead>
                <TableHead className="text-gray-300">Categoria</TableHead>
                <TableHead className="text-gray-300">Quantidade</TableHead>
                <TableHead className="text-gray-300">Preço Unitário</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Lista de produtos de exemplo - em um app real viria do banco de dados */}
              {[
                { codigo: "PRD001", produto: "Smartphone Galaxy S24", categoria: "Eletrônicos", quantidade: 45, preco: "R$ 2.999,00", status: "Em Estoque" },
                { codigo: "PRD002", produto: "Notebook Dell XPS 13", categoria: "Informática", quantidade: 12, preco: "R$ 4.899,00", status: "Em Estoque" },
                { codigo: "PRD003", produto: "Fone Bluetooth JBL", categoria: "Acessórios", quantidade: 3, preco: "R$ 299,00", status: "Estoque Baixo" },
                { codigo: "PRD004", produto: "Monitor 4K LG 27\"", categoria: "Informática", quantidade: 18, preco: "R$ 1.599,00", status: "Em Estoque" },
                { codigo: "PRD005", produto: "Teclado Mecânico RGB", categoria: "Acessórios", quantidade: 0, preco: "R$ 450,00", status: "Sem Estoque" },
                { codigo: "PRD006", produto: "Mouse Gamer Logitech", categoria: "Acessórios", quantidade: 25, preco: "R$ 189,00", status: "Em Estoque" },
                { codigo: "PRD007", produto: "Webcam Full HD", categoria: "Informática", quantidade: 8, preco: "R$ 250,00", status: "Estoque Baixo" },
              ].map((produto) => (
                <TableRow key={produto.codigo} className="border-gray-800 hover:bg-gray-900">
                  <TableCell className="text-white font-medium">{produto.codigo}</TableCell>
                  <TableCell className="text-white">{produto.produto}</TableCell>
                  <TableCell className="text-gray-300">{produto.categoria}</TableCell>
                  <TableCell className="text-white font-medium">{produto.quantidade}</TableCell>
                  <TableCell className="text-white">{produto.preco}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        produto.status === "Em Estoque" 
                          ? "bg-green-500/15 text-green-400 border-green-500/20" 
                          : produto.status === "Estoque Baixo"
                          ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                          : "bg-red-500/15 text-red-400 border-red-500/20"
                      }
                    >
                      {produto.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        Editar
                      </Button>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        Repor
                      </Button>
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
