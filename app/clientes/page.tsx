"use client"

// Imports para construir a interface de gestão de clientes
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
// Ícones específicos para métricas de clientes - cada um representa um aspecto diferente
import { ArrowUp, ArrowDown, Users, UserPlus, Star, MapPin } from 'lucide-react'

export default function ClientesPage() {
  return (
    // Layout compartilhado com sidebar e estrutura padrão
    <DashboardLayout>
      {/* Cabeçalho específico da seção de clientes */}
      <PageHeader
        title="Clientes"
        description="Gerencie e acompanhe todos os clientes"
        actions={
          <div className="flex gap-2">
            <Button className="bg-orange-500 hover:bg-orange-600">Novo Cliente</Button>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Clientes" }]}
      />

      {/* Dashboard com os números principais da base de clientes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">847</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +12 novos este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Clientes Ativos</CardTitle>
              <UserPlus className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">523</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +8% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Clientes VIP</CardTitle>
              <Star className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">67</div>
            <p className="mt-1 flex items-center text-xs text-blue-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +3 este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Novos Hoje</CardTitle>
              <MapPin className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">4</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +2 que ontem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Diretório completo de clientes com informações de contato e histórico */}
      <Card className="border-gray-800 bg-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Lista de Clientes</CardTitle>
            {/* Ferramentas de busca para encontrar clientes rapidamente */}
            <div className="flex gap-2">
              <Input
                placeholder="Buscar clientes..."
                className="w-64 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
              <Button className="bg-orange-500 hover:bg-orange-600">
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Estrutura da tabela com todas as informações relevantes */}
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">ID</TableHead>
                <TableHead className="text-gray-300">Nome</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Telefone</TableHead>
                <TableHead className="text-gray-300">Total Compras</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Dados de exemplo dos clientes - normalmente viriam de uma API */}
              {[
                { id: "CLI001", nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-1111", total: "R$ 15.200,00", status: "VIP" },
                { id: "CLI002", nome: "Maria Santos", email: "maria@email.com", telefone: "(11) 99999-2222", total: "R$ 8.450,00", status: "Ativo" },
                { id: "CLI003", nome: "Pedro Costa", email: "pedro@email.com", telefone: "(11) 99999-3333", total: "R$ 3.200,00", status: "Ativo" },
                { id: "CLI004", nome: "Ana Lima", email: "ana@email.com", telefone: "(11) 99999-4444", total: "R$ 890,00", status: "Novo" },
                { id: "CLI005", nome: "Carlos Oliveira", email: "carlos@email.com", telefone: "(11) 99999-5555", total: "R$ 0,00", status: "Inativo" },
                { id: "CLI006", nome: "Fernanda Rocha", email: "fernanda@email.com", telefone: "(11) 99999-6666", total: "R$ 22.100,00", status: "VIP" },
                { id: "CLI007", nome: "Roberto Alves", email: "roberto@email.com", telefone: "(11) 99999-7777", total: "R$ 5.670,00", status: "Ativo" },
              ].map((cliente) => (
                <TableRow key={cliente.id} className="border-gray-800 hover:bg-gray-900">
                  <TableCell className="text-white font-medium">{cliente.id}</TableCell>
                  <TableCell className="text-white">{cliente.nome}</TableCell>
                  <TableCell className="text-gray-300">{cliente.email}</TableCell>
                  <TableCell className="text-gray-300">{cliente.telefone}</TableCell>
                  <TableCell className="text-white font-medium">{cliente.total}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        cliente.status === "VIP" 
                          ? "bg-purple-500/15 text-purple-400 border-purple-500/20" 
                          : cliente.status === "Ativo"
                          ? "bg-green-500/15 text-green-400 border-green-500/20"
                          : cliente.status === "Novo"
                          ? "bg-blue-500/15 text-blue-400 border-blue-500/20"
                          : "bg-red-500/15 text-red-400 border-red-500/20"
                      }
                    >
                      {cliente.status}
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
    </DashboardLayout>
  )
}
