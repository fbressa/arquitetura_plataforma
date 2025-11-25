"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { Users, UserPlus, Star, MapPin, Pencil, Trash2 } from 'lucide-react'
import { useAppContext } from "@/app/context/AppContext"
import { useSPANavigation } from "@/hooks/use-spa-navigation"
import {
  getClientsRequest,
  createClientRequest,
  updateClientRequest,
  deleteClientRequest,
} from "@/lib/api"
import { Client, CreateClientRequest } from "@/lib/types/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function ClientesPage() {
  const { addNotification } = useAppContext()
  const { navigate } = useSPANavigation()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [formData, setFormData] = useState<CreateClientRequest>({
    companyName: "",
    contactPerson: "",
    cnpj: "",
  })

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login', true)
        return
      }

      const data = await getClientsRequest(token)
      setClients(data)
      setLoading(false)
    } catch (error: any) {
      addNotification({ type: 'error', message: error.message || 'Erro ao carregar clientes' })
      setLoading(false)
    }
  }

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client)
      setFormData({
        companyName: client.companyName,
        contactPerson: client.contactPerson,
        cnpj: client.cnpj || "",
      })
    } else {
      setEditingClient(null)
      setFormData({
        companyName: "",
        contactPerson: "",
        cnpj: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingClient(null)
    setFormData({
      companyName: "",
      contactPerson: "",
      cnpj: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login', true)
        return
      }

      if (editingClient) {
        await updateClientRequest(token, editingClient.id, formData)
        addNotification({ type: 'success', message: 'Cliente atualizado com sucesso!' })
      } else {
        await createClientRequest(token, formData)
        addNotification({ type: 'success', message: 'Cliente criado com sucesso!' })
      }

      handleCloseDialog()
      loadClients()
    } catch (error: any) {
      addNotification({ type: 'error', message: error.message || 'Erro ao salvar cliente' })
    }
  }

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login', true)
        return
      }

      await deleteClientRequest(token, clientToDelete.id)
      addNotification({ type: 'success', message: 'Cliente deletado com sucesso!' })
      setIsDeleteDialogOpen(false)
      setClientToDelete(null)
      loadClients()
    } catch (error: any) {
      addNotification({ type: 'error', message: error.message || 'Erro ao deletar cliente' })
    }
  }

  const filteredClients = clients.filter(client =>
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.cnpj && client.cnpj.includes(searchTerm))
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Carregando clientes...</p>
        </div>
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout>
      <PageHeader
        title="Clientes"
        description="Gerencie e acompanhe todos os clientes"
        actions={
          <div className="flex gap-2">
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => handleOpenDialog()}
            >
              Novo Cliente
            </Button>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Clientes" }]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{clients.length}</div>
            <p className="mt-1 flex items-center text-xs text-gray-400">
              Clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Com CNPJ</CardTitle>
              <UserPlus className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">
              {clients.filter(c => c.cnpj).length}
            </div>
            <p className="mt-1 flex items-center text-xs text-gray-400">
              Empresas registradas
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Sem CNPJ</CardTitle>
              <Star className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">
              {clients.filter(c => !c.cnpj).length}
            </div>
            <p className="mt-1 flex items-center text-xs text-gray-400">
              Clientes pessoa física
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
            <div className="text-2xl font-semibold text-white">
              {clients.filter(c => {
                const today = new Date().toDateString()
                return new Date(c.createdAt).toDateString() === today
              }).length}
            </div>
            <p className="mt-1 flex items-center text-xs text-gray-400">
              Cadastrados hoje
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-800 bg-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Lista de Clientes</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar clientes..."
                className="w-64 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">Empresa</TableHead>
                <TableHead className="text-gray-300">Responsável</TableHead>
                <TableHead className="text-gray-300">CNPJ</TableHead>
                <TableHead className="text-gray-300">Cadastrado em</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-gray-800 hover:bg-gray-900">
                    <TableCell className="text-white font-medium">{client.companyName}</TableCell>
                    <TableCell className="text-gray-300">{client.contactPerson}</TableCell>
                    <TableCell className="text-gray-300">
                      {client.cnpj || <span className="text-gray-600 italic">Não informado</span>}
                    </TableCell>
                    <TableCell className="text-gray-300">{formatDate(client.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          onClick={() => handleOpenDialog(client)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-700 text-red-400 hover:bg-red-950"
                          onClick={() => handleDeleteClick(client)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para Criar/Editar Cliente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingClient ? 'Atualize as informações do cliente' : 'Preencha os dados do novo cliente'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="bg-gray-950 border-gray-800 text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPerson">Pessoa de Contato *</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="bg-gray-950 border-gray-800 text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  className="bg-gray-950 border-gray-800 text-white"
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="border-gray-700 text-gray-300"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                {editingClient ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o cliente <strong>{clientToDelete?.companyName}</strong>? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-700 text-gray-300"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
