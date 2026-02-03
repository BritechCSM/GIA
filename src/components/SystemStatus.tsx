import { Server, Database, Wifi, Shield, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"

const systemMetrics = [
  {
    name: "API Response",
    value: "120ms",
    status: "good",
    progress: 85
  },
  {
    name: "Database",
    value: "98.9%",
    status: "good",
    progress: 99
  },
  {
    name: "Storage",
    value: "67%",
    status: "warning",
    progress: 67
  },
  {
    name: "Network",
    value: "99.2%",
    status: "good",
    progress: 99
  }
]

const recentAlerts = [
  {
    type: "warning",
    message: "Storage usage above 65%",
    time: "2 hours ago"
  },
  {
    type: "info",
    message: "Database backup completed",
    time: "6 hours ago"
  },
  {
    type: "success",
    message: "All systems operational",
    time: "1 day ago"
  }
]

export function SystemStatus() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Satoshi' }}>
            <Activity className="w-4 h-4" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {systemMetrics.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{metric.name}</span>
                <span className="text-sm font-medium">{metric.value}</span>
              </div>
              <Progress 
                value={metric.progress} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base" style={{ fontFamily: 'Satoshi' }}>
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentAlerts.map((alert, index) => (
            <div key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                alert.type === 'warning' ? 'bg-yellow-500' :
                alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}