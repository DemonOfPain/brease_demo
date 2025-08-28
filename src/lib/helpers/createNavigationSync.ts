import { SiteNavigationItem, SiteNavigationSync } from '@/interface/site'

export const createNavigationSync = (items: SiteNavigationItem[]): SiteNavigationSync => {
  return items.map((item) => ({
    id: item.uuid,
    children: item.children ? createNavigationSync(item.children) : []
  }))
}
