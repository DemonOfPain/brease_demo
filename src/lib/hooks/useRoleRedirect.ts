import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from './useUserStore'
import { UserRole } from '@/interface/user'
import { toast } from '@/components/shadcn/ui/use-toast'

//TODO: configure this in depth later (v2)
export function useRoleRedirect() {
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const storeHydrated = useUserStore((state) => state.storeHydrated)

  useEffect(() => {
    if (!storeHydrated) return
    if (user.currentTeam.userRole != UserRole.administrator) {
      router.push('/dashboard/sites')
      toast({
        variant: 'warning',
        title: 'Not authorized by role!',
        description: 'Your role has to be Administrator to use this feature.'
      })
    }
  }, [storeHydrated])
}
