"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Users, UserPlus, Search, Calendar } from "lucide-react"
import { getUsersRequest, createUserRequest, updateUserRequest, deleteUserRequest } from "@/lib/api"
import { User, CreateUserRequest, UpdateUserRequest } from "@/lib/types/user"
import { toast } from "sonner"

export default function MembrosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: "",
    email: "",
    password: "",
  })
  const [editFormData, setEditFormData] = useState<UpdateUserRequest>({
    name: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Token não encontrado. Faça login novamente.")
        return
      }
      const data = await getUsersRequest(token)
      setUsers(data)
    } catch (error: any) {
      console.error("Erro ao carregar usuários:", error)
      toast.error(error.message || "Erro ao carregar usuários")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Preencha todos os campos")
      return
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Token não encontrado")
        return
      }

      await createUserRequest(token, formData)
      toast.success("Usuário criado com sucesso!")
      setIsCreateDialogOpen(false)
      setFormData({ name: "", email: "", password: "" })
      await loadUsers()
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error)
      toast.error(error.message || "Erro ao criar usuário")
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser) return

    if (!editFormData.name && !editFormData.email && !editFormData.password) {
      toast.error("Preencha pelo menos um campo para atualizar")
      return
    }

    if (editFormData.password && editFormData.password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Token não encontrado")
        return
      }

      const updateData: UpdateUserRequest = {}
      if (editFormData.name) updateData.name = editFormData.name
      if (editFormData.email) updateData.email = editFormData.email
      if (editFormData.password) updateData.password = editFormData.password

      await updateUserRequest(token, selectedUser.id, updateData)
      toast.success("Usuário atualizado com sucesso!")
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      setEditFormData({ name: "", email: "", password: "" })
      await loadUsers()
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error)
      toast.error(error.message || "Erro ao atualizar usuário")
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Token não encontrado")
        return
      }

      await deleteUserRequest(token, selectedUser.id)
      toast.success("Usuário deletado com sucesso!")
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
      await loadUsers()
    } catch (error: any) {
      console.error("Erro ao deletar usuário:", error)
      toast.error(error.message || "Erro ao deletar usuário")
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setEditFormData({
      name: user.name,
      email: user.email,
      password: "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const newUsersToday = users.filter((user) => {
    const userDate = new Date(user.createdAt)
    userDate.setHours(0, 0, 0, 0)
    return userDate.getTime() === today.getTime()
  }).length

  return (
    <DashboardLayout>
      <PageHeader
        title="Gerenciamento de Membros"
        description="Gerencie usuários e permissões do sistema"
        actions={
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Membro
          </Button>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Membros" }]}
      />

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Membros</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{users.length}</div>
            <p className="mt-1 text-xs text-gray-400">
              Usuários cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Novos Hoje</CardTitle>
              <UserPlus className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{newUsersToday}</div>
            <p className="mt-1 text-xs text-gray-400">
              Membros cadastrados hoje
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Ativos</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{users.length}</div>
            <p className="mt-1 text-xs text-gray-400">
              Membros ativos no sistema
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-800 bg-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Lista de Membros</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  className="pl-8 w-64 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Carregando membros...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-900/50">
                  <TableHead className="text-gray-400">Nome</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Data de Cadastro</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                      Nenhum membro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-gray-800 hover:bg-gray-900/50"
                    >
                      <TableCell className="text-white font-medium">{user.name}</TableCell>
                      <TableCell className="text-gray-300">{user.email}</TableCell>
                      <TableCell className="text-gray-300">{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-green-500/15 text-green-400 border-green-500/20"
                        >
                          Ativo
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            onClick={() => openEditDialog(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => openDeleteDialog(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-950 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Criar Novo Membro</DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha os dados do novo membro do sistema
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Ex: João Silva"
                className="bg-gray-900 border-gray-800 text-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: joao@exemplo.com"
                className="bg-gray-900 border-gray-800 text-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                className="bg-gray-900 border-gray-800 text-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-800 text-gray-300"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setFormData({ name: "", email: "", password: "" })
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleCreateUser}
            >
              Criar Membro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-950 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Editar Membro</DialogTitle>
            <DialogDescription className="text-gray-400">
              Atualize os dados do membro. Deixe os campos vazios para mantê-los inalterados.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-gray-300">Nome Completo</Label>
              <Input
                id="edit-name"
                placeholder={selectedUser?.name}
                className="bg-gray-900 border-gray-800 text-white"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-gray-300">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder={selectedUser?.email}
                className="bg-gray-900 border-gray-800 text-white"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password" className="text-gray-300">Nova Senha</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="Deixe vazio para não alterar"
                className="bg-gray-900 border-gray-800 text-white"
                value={editFormData.password}
                onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-800 text-gray-300"
              onClick={() => {
                setIsEditDialogOpen(false)
                setSelectedUser(null)
                setEditFormData({ name: "", email: "", password: "" })
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleEditUser}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-950 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja deletar o membro <strong>{selectedUser?.name}</strong>? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteUser}
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
