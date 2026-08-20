export interface IDashboardNavItem {
  label: string
  href: string
  icon: string
}

export interface IDashboardNavGroup {
  label: string
  items: IDashboardNavItem[]
}
