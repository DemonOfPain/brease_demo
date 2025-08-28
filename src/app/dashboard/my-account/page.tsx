'use client'
import { MyAccountForm } from '@/components/dashboard/my-account/MyAccountForm'
//import PreferencesForm from '@/components/dashboard/my-account/PreferencesForm'
import { SecurityForm } from '@/components/dashboard/my-account/SecurityForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/ui/tabs'
import { MyAccountSkeleton } from '@/components/dashboard/my-account/MyAccountSkeleton'
import { useUserStore } from '@/lib/hooks/useUserStore'

export default function MyAccountPage() {
  const user = useUserStore((state) => state.user)

  if (user.uuid) {
    return (
      <div className="w-full h-fit flex flex-col gap-6 pb-10">
        <Tabs defaultValue="my-account" className="w-full">
          <TabsList>
            <TabsTrigger value="my-account">My Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            {/* <TabsTrigger value="preferences">Preferences</TabsTrigger> */}
          </TabsList>
          <TabsContent value="my-account">
            <MyAccountForm user={user} />
          </TabsContent>
          <TabsContent value="security">
            <SecurityForm user={user} />
          </TabsContent>
          {/* <TabsContent value="preferences">
            <PreferencesForm user={user} />
          </TabsContent> */}
        </Tabs>
      </div>
    )
  } else {
    return <MyAccountSkeleton />
  }
}
