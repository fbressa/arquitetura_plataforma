"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from 'lucide-react'
import { useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { CurrencyInput } from "@/components/currency-input"
import { Input } from "@/components/ui/input"
import { useAppContext } from "@/app/context/AppContext"
import { useSPANavigation } from "@/hooks/use-spa-navigation"
import { createRefundRequest } from "@/lib/api"

export default function NovoReembolsoPage() {
  const { addNotification, userInfo } = useAppContext()
  const { navigate } = useSPANavigation()
  const [anexos, setAnexos] = useState<string[]>([])
  const [valor, setValor] = useState<number>(0)
  const [descricao, setDescricao] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const totalFormatado = useMemo(
    () =>
      (valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }),
    [valor],
  )

  const adicionarAnexo = () => setAnexos((prev) => [...prev, `Comprovante-${prev.length + 1}.pdf`])
  const removerAnexo = (index: number) => setAnexos((prev) => prev.filter((_, i) => i !== index))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userInfo?.id) {
      addNotification({ type: 'error', message: 'Usuário não autenticado' })
      navigate('/login', true)
      return
    }

    if (!descricao.trim()) {
      addNotification({ type: 'error', message: 'Descrição é obrigatória' })
      return
    }

    if (!valor || valor <= 0) {
      addNotification({ type: 'error', message: 'Valor deve ser maior que zero' })
      return
    }

    if (isNaN(valor)) {
      addNotification({ type: 'error', message: 'Valor inválido' })
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login', true)
        return
      }

      const refundData = {
        description: String(descricao).trim(),
        amount: Number(valor),
        userId: String(userInfo.id)
      }

      console.log('=== REFUND DATA DEBUG ===')
      console.log('Raw values:', { descricao, valor, userId: userInfo.id })
      console.log('Processed data:', refundData)
      console.log('Types:', {
        description: typeof refundData.description,
        amount: typeof refundData.amount,
        userId: typeof refundData.userId
      })
      console.log('JSON to send:', JSON.stringify(refundData))
      console.log('========================')

      await createRefundRequest(token, refundData)

      addNotification({ 
        type: 'success', 
        message: 'Solicitação de reembolso criada com sucesso!' 
      })
      navigate('/reembolsos', true)
    } catch (error: any) {
      addNotification({ 
        type: 'error', 
        message: error.message || 'Erro ao criar solicitação de reembolso' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Nova Solicitação de Reembolso"
        description="Preencha os dados para solicitar o reembolso de despesas"
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Reembolsos", href: "/reembolsos" },
          { label: "Nova" },
        ]}
      />

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Form principal */}
        <div className="lg:col-span-2">
          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Dados da Despesa</CardTitle>
              <CardDescription className="text-gray-400">
                Informe os detalhes da despesa que deseja reembolsar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="funcionario" className="text-gray-300">
                    Funcionário
                  </Label>
                  <Input
                    id="funcionario"
                    value={userInfo?.name || 'Carregando...'}
                    className="border-gray-800 bg-gray-950 text-white"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor" className="text-gray-300">
                    Valor (R$) *
                  </Label>
                  <CurrencyInput
                    id="valor"
                    value={valor}
                    onValueChange={setValor}
                    placeholder="R$ 0,00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-gray-300">
                  Descrição *
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o motivo da despesa..."
                  className="min-h-[100px] border-gray-800 bg-gray-950 text-white"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Comprovantes */}
          <Card className="mt-6 border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Comprovantes</CardTitle>
              <CardDescription className="text-gray-400">Anexe os comprovantes da despesa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-dashed border-gray-800 bg-gray-950 p-6 text-center">
                <Upload className="mx-auto mb-2 h-6 w-6 text-orange-500" />
                <p className="text-sm text-gray-300">
                  Arraste e solte arquivos aqui ou{" "}
                  <button className="font-medium text-orange-500 hover:text-orange-400" onClick={adicionarAnexo} type="button">
                    clique para selecionar
                  </button>
                </p>
                <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG até 5MB</p>
              </div>

              {anexos.length > 0 && (
                <div className="space-y-2">
                  {anexos.map((anexo, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-gray-950 p-2">
                      <span className="text-sm text-white">{anexo}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removerAnexo(index)}
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumo fixo */}
        <div className="lg:sticky lg:top-24">
          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Resumo</CardTitle>
              <CardDescription className="text-gray-400">Confira antes de enviar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span className="text-yellow-400">Novo</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Solicitante</span>
                <span className="text-white">{userInfo?.name || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Valor Total</span>
                <span className="font-medium text-white">{totalFormatado}</span>
              </div>
              <div className="pt-2">
                <Button 
                  className="w-full bg-orange-500 text-white hover:bg-orange-600" 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Enviando...' : 'Enviar Solicitação'}
                </Button>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-gray-800 text-gray-300 hover:bg-gray-950" 
                type="button"
                onClick={() => navigate('/reembolsos', true)}
              >
                Cancelar
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </DashboardLayout>
  )
}
