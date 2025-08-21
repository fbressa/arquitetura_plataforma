import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback className="bg-orange-500">JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium text-white">João da Silva</p>
          <p className="text-xs text-gray-400">joao@empresa.com</p>
        </div>
        <div className="ml-auto font-medium text-white">R$ 1.999,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback className="bg-orange-500">MS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium text-white">Maria Santos</p>
          <p className="text-xs text-gray-400">maria@tech.com</p>
        </div>
        <div className="ml-auto font-medium text-white">R$ 3.499,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback className="bg-orange-500">PO</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium text-white">Pedro Oliveira</p>
          <p className="text-xs text-gray-400">pedro@loja.com</p>
        </div>
        <div className="ml-auto font-medium text-white">R$ 2.750,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback className="bg-orange-500">AC</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium text-white">Ana Costa</p>
          <p className="text-xs text-gray-400">ana@mercado.com</p>
        </div>
        <div className="ml-auto font-medium text-white">R$ 899,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback className="bg-orange-500">LM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium text-white">Lucas Mendes</p>
          <p className="text-xs text-gray-400">lucas@distribuidora.com</p>
        </div>
        <div className="ml-auto font-medium text-white">R$ 4.320,00</div>
      </div>
    </div>
  )
}
