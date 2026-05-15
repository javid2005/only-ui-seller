import type { LucideIcon } from 'lucide-react'

export interface SubNavItem {
  label: string
  path: string
  disabled?: boolean
}

export interface NavItem {
  label: string
  icon: LucideIcon
  path: string
  subItems?: SubNavItem[]
  disabled?: boolean
}

export interface NavGroup {
  group: string
  items: NavItem[]
}
