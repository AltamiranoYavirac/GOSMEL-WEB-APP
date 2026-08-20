export interface IDashboardNavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

export interface IDashboardNavGroup {
  label: string
  items: IDashboardNavItem[]
}
