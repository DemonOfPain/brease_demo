import { PrimarySideMenuItem } from './PrimarySideMenuItem'

const DashboardSideMenuPrimaryMenu = () => {
  return (
    <div
      className={`w-full rounded-lg bg-brease-gray-2 p-2 shadow-brease-xs transition-all duration-1000 ease-in-out`}
    >
      <ul>
        <PrimarySideMenuItem
          link={'/dashboard/sites'}
          label="Sites"
          isDropdown={false}
          icon="Proportions"
        />
        <PrimarySideMenuItem
          link={'/dashboard/teams'}
          label="Teams"
          isDropdown={false}
          icon="Users"
        />
      </ul>
    </div>
  )
}

export default DashboardSideMenuPrimaryMenu
