"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from 'lucide-react'
import { useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { CurrencyInput } from "@/components/currency-input"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function NovoReembolsoPage() {
  const [anexos, setAnexos] = useState<string[]>([])
  const [valor, setValor] = useState<number>(0)
  const [categoria, setCategoria] = useState<string>("combustivel")
  const { toast } = useToast()

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação de reembolso foi enviada para aprovação.",
    })
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
                    defaultValue="João Silva"
                    className="border-gray-800 bg-gray-950 text-white"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data" className="text-gray-300">
                    Data da Despesa
                  </Label>
                  <Input id="data" type="date" className="border-gray-800 bg-gray-950 text-white" required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="categoria" className="text-gray-300">
                    Categoria
                  </Label>
                  <Select defaultValue={categoria} onValueChange={setCategoria}>
                    <SelectTrigger className="border-gray-800 bg-gray-950 text-white">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-800 bg-black text-gray-200">
                      <SelectItem value="combustivel">Combustível</SelectItem>
                      <SelectItem value="alimentacao">Alimentação</SelectItem>
                      <SelectItem value="transporte">Transporte</SelectItem>
                      <SelectItem value="hospedagem">Hospedagem</SelectItem>
                      <SelectItem value="material">Material de Escritório</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor" className="text-gray-300">
                    Valor (R$)
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
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o motivo da despesa..."
                  className="min-h-[100px] border-gray-800 bg-gray-950 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="justificativa" className="text-gray-300">
                  Justificativa Comercial
                </Label>
                <Textarea
                  id="justificativa"
                  placeholder="Explique como esta despesa beneficia a empresa..."
                  className="min-h-[80px] border-gray-800 bg-gray-950 text-white"
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
                <span className="text-yellow-400">Rascunho</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Categoria</span>
                <span className="text-white capitalize">{categoria}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Valor Total</span>
                <span className="font-medium text-white">{totalFormatado}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Anexos</span>
                <span className="text-white">{anexos.length}</span>
              </div>
              <div className="pt-2">
                <Button className="w-full bg-orange-500 text-white hover:bg-orange-600" type="submit">
                  Enviar Solicitação
                </Button>
              </div>
              <Button variant="outline" className="w-full border-gray-800 text-gray-300 hover:bg-gray-950" type="button">
                Salvar Rascunho
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </DashboardLayout>
  )
}
