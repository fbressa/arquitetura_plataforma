import { Progress } from "@/components/ui/progress"

export function TopProducts() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-white">Notebook Pro X</p>
          <span className="text-sm text-gray-400">32%</span>
        </div>
        <Progress value={32} className="h-2 bg-gray-800" indicatorClassName="bg-orange-500" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-white">Smartphone Galaxy</p>
          <span className="text-sm text-gray-400">28%</span>
        </div>
        <Progress value={28} className="h-2 bg-gray-800" indicatorClassName="bg-orange-500" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-white">Monitor UltraWide</p>
          <span className="text-sm text-gray-400">21%</span>
        </div>
        <Progress value={21} className="h-2 bg-gray-800" indicatorClassName="bg-orange-500" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-white">Teclado Mecânico</p>
          <span className="text-sm text-gray-400">14%</span>
        </div>
        <Progress value={14} className="h-2 bg-gray-800" indicatorClassName="bg-orange-500" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-white">Mouse Gamer</p>
          <span className="text-sm text-gray-400">5%</span>
        </div>
        <Progress value={5} className="h-2 bg-gray-800" indicatorClassName="bg-orange-500" />
      </div>
    </div>
  )
}
