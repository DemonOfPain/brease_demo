import { SiteDetail } from '@/interface/site'
import { PrimarySideMenuItem } from '../dashboard-layout/PrimarySideMenuItem'
import { UserRole } from '@/interface/user'
import { useUserStore } from '@/lib/hooks/useUserStore'

export const SiteDashboardSideMenuPrimaryMenu = ({ site }: { site: SiteDetail }) => {
  const userRole = useUserStore((state) => state.user.currentTeam?.userRole || 'admin')
  return (
    <div
      className={`w-full rounded-lg bg-brease-gray-2 p-2 shadow-brease-xs transition-all duration-1000 ease-in-out`}
    >
      <ul>
        <PrimarySideMenuItem
          link={`/dashboard/sites/${site.uuid}/pages`}
          label="Pages"
          isDropdown={false}
          icon="File"
        />
        {userRole === UserRole.administrator && (
          <PrimarySideMenuItem
            link={`/dashboard/sites/${site.uuid}/navigations`}
            label="Navigations"
            isDropdown={false}
            icon="Route"
          />
        )}
        <PrimarySideMenuItem
          link={`/dashboard/sites/${site.uuid}/languages`}
          label="Languages"
          isDropdown={false}
          icon="Languages"
        />
        <PrimarySideMenuItem
          link={`/dashboard/sites/${site.uuid}/redirects`}
          label="Redirects"
          isDropdown={false}
          icon="Milestone"
        />
        {/* <PrimarySideMenuItem
          link={`/dashboard/sites/${site.uuid}/integrations`}
          label="Integrations"
          isDropdown={false}
          icon="Package"
        /> */}
        <PrimarySideMenuItem
          link={`/dashboard/sites/${site.uuid}/settings`}
          label="Site Settings"
          isDropdown={false}
          icon="Settings2"
        />
      </ul>
    </div>
  )
}
