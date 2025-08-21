"use client"

// Componentes necessários para construir a interface de vendas
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
// Ícones para mostrar tendências e tipos de dados nas métricas
import { ArrowUp, ArrowDown, DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react'

export default function VendasPage() {
  return (
    // Estrutura base da aplicação com navegação lateral
    <DashboardLayout>
      {/* Topo da página com informações e ação principal */}
      <PageHeader
        title="Vendas"
        description="Gerencie e acompanhe todas as vendas da empresa"
        actions={
          <div className="flex gap-2">
            <Button className="bg-orange-500 hover:bg-orange-600">Nova Venda</Button>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Vendas" }]}
      />

      {/* Indicadores de performance do dia - visão rápida dos números importantes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Vendas Hoje</CardTitle>
              <ShoppingCart className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">12</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +8% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Receita Hoje</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">R$ 2.840,50</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +15% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">R$ 236,70</div>
            <p className="mt-1 flex items-center text-xs text-red-400">
              <ArrowDown className="mr-1 h-3 w-3" />
              -3% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Clientes Únicos</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">8</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +2 novos clientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Organização em abas para separar vendas por status - facilita a navegação */}
      <Tabs defaultValue="todas" className="w-full">
        {/* Menu de navegação entre as diferentes categorias */}
        <TabsList className="grid w-full grid-cols-4 bg-gray-900 text-gray-300">
          <TabsTrigger value="todas" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Todas as Vendas
          </TabsTrigger>
          <TabsTrigger value="concluidas" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Concluídas
          </TabsTrigger>
          <TabsTrigger value="pendentes" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Pendentes
          </TabsTrigger>
          <TabsTrigger value="canceladas" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Canceladas
          </TabsTrigger>
        </TabsList>

        {/* Aba principal - mostra todas as vendas independente do status */}
        <TabsContent value="todas" className="mt-6">
          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Todas as Vendas</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar vendas..."
                    className="w-64 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Filtrar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-300">Cliente</TableHead>
                    <TableHead className="text-gray-300">Produtos</TableHead>
                    <TableHead className="text-gray-300">Total</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "#001", cliente: "João Silva", produtos: "3 itens", total: "R$ 450,00", data: "Hoje, 14:30", status: "Concluída" },
                    { id: "#002", cliente: "Maria Santos", produtos: "1 item", total: "R$ 120,00", data: "Hoje, 13:15", status: "Pendente" },
                    { id: "#003", cliente: "Pedro Costa", produtos: "5 itens", total: "R$ 780,00", data: "Hoje, 12:45", status: "Concluída" },
                    { id: "#004", cliente: "Ana Lima", produtos: "2 itens", total: "R$ 290,00", data: "Hoje, 11:20", status: "Concluída" },
                    { id: "#005", cliente: "Carlos Oliveira", produtos: "4 itens", total: "R$ 650,00", data: "Hoje, 10:35", status: "Pendente" },
                  ].map((venda) => (
                    <TableRow key={venda.id} className="border-gray-800 hover:bg-gray-900">
                      <TableCell className="text-white font-medium">{venda.id}</TableCell>
                      <TableCell className="text-white">{venda.cliente}</TableCell>
                      <TableCell className="text-gray-300">{venda.produtos}</TableCell>
                      <TableCell className="text-white font-medium">{venda.total}</TableCell>
                      <TableCell className="text-gray-300">{venda.data}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            venda.status === "Concluída" 
                              ? "bg-green-500/15 text-green-400 border-green-500/20" 
                              : "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                          }
                        >
                          {venda.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            Ver
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            Editar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concluidas" className="mt-6">
          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Vendas Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-300">Cliente</TableHead>
                    <TableHead className="text-gray-300">Total</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "#001", cliente: "João Silva", total: "R$ 450,00", data: "Hoje, 14:30" },
                    { id: "#003", cliente: "Pedro Costa", total: "R$ 780,00", data: "Hoje, 12:45" },
                    { id: "#004", cliente: "Ana Lima", total: "R$ 290,00", data: "Hoje, 11:20" },
                  ].map((venda) => (
                    <TableRow key={venda.id} className="border-gray-800 hover:bg-gray-900">
                      <TableCell className="text-white font-medium">{venda.id}</TableCell>
                      <TableCell className="text-white">{venda.cliente}</TableCell>
                      <TableCell className="text-white font-medium">{venda.total}</TableCell>
                      <TableCell className="text-gray-300">{venda.data}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendentes" className="mt-6">
          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Vendas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-300">Cliente</TableHead>
                    <TableHead className="text-gray-300">Total</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "#002", cliente: "Maria Santos", total: "R$ 120,00", data: "Hoje, 13:15" },
                    { id: "#005", cliente: "Carlos Oliveira", total: "R$ 650,00", data: "Hoje, 10:35" },
                  ].map((venda) => (
                    <TableRow key={venda.id} className="border-gray-800 hover:bg-gray-900">
                      <TableCell className="text-white font-medium">{venda.id}</TableCell>
                      <TableCell className="text-white">{venda.cliente}</TableCell>
                      <TableCell className="text-white font-medium">{venda.total}</TableCell>
                      <TableCell className="text-gray-300">{venda.data}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Finalizar
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/10">
                            Cancelar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="canceladas" className="mt-6">
          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Vendas Canceladas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhuma venda cancelada hoje.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}