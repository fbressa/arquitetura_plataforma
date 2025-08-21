"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter } from 'lucide-react'
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { useAppContext } from "@/app/context/AppContext"

export default function ReembolsosPage() {
  const { addNotification } = useAppContext()

  const handleNotificationTest = () => {
    addNotification({
      type: "success",
      message: "Notificação de teste criada com sucesso!"
    })
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Reembolsos"
        description="Gerencie solicitações de reembolso de despesas"
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Reembolsos" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleNotificationTest}>
              Testar Notificação
            </Button>
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
                placeholder="Buscar por funcionário, categoria ou descrição..."
                className="h-8 border-0 bg-transparent text-sm placeholder:text-gray-500 focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-800 text-gray-300 hover:bg-gray-950">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Tabs defaultValue="todas">
              <TabsList className="grid w-full grid-cols-4 bg-gray-950">
                {[
                  { v: "todas", l: "Todas" },
                  { v: "pendentes", l: "Pendentes" },
                  { v: "aprovadas", l: "Aprovadas" },
                  { v: "rejeitadas", l: "Rejeitadas" },
                ].map((t) => (
                  <TabsTrigger
                    key={t.v}
                    value={t.v}
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    {t.l}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="todas" className="mt-4">
                <div className="rounded-lg border border-gray-800">
                  <div className="max-h-[480px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 z-10 bg-black">
                        <TableRow className="border-gray-800">
                          <TableHead className="text-gray-300">ID</TableHead>
                          <TableHead className="text-gray-300">Funcionário</TableHead>
                          <TableHead className="text-gray-300">Categoria</TableHead>
                          <TableHead className="text-gray-300">Descrição</TableHead>
                          <TableHead className="text-gray-300">Valor</TableHead>
                          <TableHead className="text-gray-300">Data</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { id: "R001", nome: "João Silva", cat: "Combustível", desc: "Viagem cliente ABC", valor: "R$ 120,00", data: "10/06/2025", status: "Pendente" },
                          { id: "R002", nome: "Maria Santos", cat: "Alimentação", desc: "Almoço com cliente XYZ", valor: "R$ 85,50", data: "09/06/2025", status: "Aprovado" },
                          { id: "R003", nome: "Pedro Costa", cat: "Material", desc: "Materiais de escritório", valor: "R$ 245,30", data: "08/06/2025", status: "Pendente" },
                          { id: "R004", nome: "Ana Oliveira", cat: "Transporte", desc: "Uber para reunião", valor: "R$ 32,50", data: "07/06/2025", status: "Rejeitado" },
                          { id: "R005", nome: "Carlos Mendes", cat: "Hospedagem", desc: "Hotel viagem negócios", valor: "R$ 450,00", data: "06/06/2025", status: "Aprovado" },
                        ].map((r, idx) => (
                          <TableRow
                            key={r.id}
                            className={`border-gray-800 hover:bg-gray-950 ${idx % 2 === 0 ? "bg-black" : "bg-gray-950/60"}`}
                          >
                            <TableCell className="font-mono text-white">#{r.id}</TableCell>
                            <TableCell className="text-white">{r.nome}</TableCell>
                            <TableCell className="text-white">{r.cat}</TableCell>
                            <TableCell className="text-white">{r.desc}</TableCell>
                            <TableCell className="text-white">{r.valor}</TableCell>
                            <TableCell className="text-white">{r.data}</TableCell>
                            <TableCell className="text-white">
                              <StatusBadge status={r.status as any} />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {r.status === "Pendente" && (
                                  <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
                                    Aprovar
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-800 text-gray-300 hover:bg-gray-950"
                                >
                                  Ver
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Paginação simples */}
                  <div className="flex items-center justify-between border-t border-gray-800 bg-black px-3 py-2 text-sm text-gray-400">
                    <span>Mostrando 1–5 de 28</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-800 text-gray-300 hover:bg-gray-950">
                        Anterior
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-800 text-gray-300 hover:bg-gray-950">
                        Próximo
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
