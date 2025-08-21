import { type ReactNode } from "react"
import { Breadcrumbs } from "./breadcrumbs"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

export function PageHeader({ title, description, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length ? (
        <div className="mb-2">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      ) : null}
      <div className="flex flex-col gap-3 border-b border-gray-800 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
          {description ? <p className="text-sm text-gray-400">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}
