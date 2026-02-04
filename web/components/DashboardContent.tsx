import { KPICards } from "./KPICards"
import { IntegrationModules } from "./IntegrationModules"
import { RecentActivity } from "./RecentActivity"
import { SystemStatus } from "./SystemStatus"

export function DashboardContent() {
  return (
    <div className="flex-1 p-6 space-y-6 bg-muted/30">
      <div>
        <h1 style={{ fontFamily: 'Satoshi' }}>Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor all of your business operations and integrations from here.
        </p>
      </div>

      <KPICards />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <IntegrationModules />
        </div>
        <div className="space-y-6">
          <SystemStatus />
        </div>
      </div>

      <RecentActivity />
    </div>
  )
}
