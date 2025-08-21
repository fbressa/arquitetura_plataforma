import Link from "next/link"

type Crumb = { label: string; href?: string }

interface BreadcrumbsProps {
  items: Crumb[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link className="hover:text-gray-200" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-300">{item.label}</span>
              )}
              {!last ? <span className="px-1 text-gray-600">{"/"}</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
