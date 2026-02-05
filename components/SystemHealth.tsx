import { Activity, Server, Cpu, HardDrive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface HealthMetricProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
}

function HealthMetric({ label, value, icon, gradient }: HealthMetricProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-slate-600">{icon}</div>
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-sm font-semibold text-slate-900">{value}%</span>
      </div>
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full ${gradient} rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function SystemHealth() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* System Status Card */}
      <Card className="rounded-xl shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-600" />
            <CardTitle className="text-lg" style={{ fontFamily: 'Satoshi' }}>
              System Status
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <HealthMetric
            label="API Response Time"
            value={92}
            icon={<Server className="w-4 h-4" />}
            gradient="bg-gradient-to-r from-violet-600 to-violet-400"
          />
          <HealthMetric
            label="Database Load"
            value={67}
            icon={<HardDrive className="w-4 h-4" />}
            gradient="bg-gradient-to-r from-amber-500 to-amber-300"
          />
          <HealthMetric
            label="CPU Usage"
            value={45}
            icon={<Cpu className="w-4 h-4" />}
            gradient="bg-gradient-to-r from-emerald-500 to-emerald-300"
          />
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <Card className="rounded-xl shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg" style={{ fontFamily: 'Satoshi' }}>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Data sync completed', source: 'PostgreSQL', time: '2 minutes ago', status: 'success' },
              { action: 'New order processed', source: 'Shopify', time: '5 minutes ago', status: 'success' },
              { action: 'Payment received', source: 'Stripe', time: '12 minutes ago', status: 'success' },
              { action: 'Webhook triggered', source: 'API', time: '18 minutes ago', status: 'info' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activity.source} · {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
