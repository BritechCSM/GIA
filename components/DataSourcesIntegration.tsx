import { CreditCard, ShoppingBag, Database, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface DataSourceCardProps {
  name: string;
  icon: React.ReactNode;
  status: 'active' | 'syncing' | 'error';
  lastSync: string;
  rows: string;
  iconColor: string;
}

function DataSourceCard({ name, icon, status, lastSync, rows, iconColor }: DataSourceCardProps) {
  const statusConfig = {
    active: { label: 'Active', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
    syncing: { label: 'Syncing', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
    error: { label: 'Error', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
  };

  return (
    <Card className="rounded-xl shadow-sm border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center`}>
            {icon}
          </div>
          <Badge className={statusConfig[status].className}>
            {statusConfig[status].label}
          </Badge>
        </div>
        <h4 className="font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Satoshi' }}>
          {name}
        </h4>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Last Sync:</span>
            <span className="text-slate-700 font-medium">{lastSync}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Rows:</span>
            <span className="text-slate-700 font-medium">{rows}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DataSourcesIntegration() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Satoshi' }}>
          Data Sources & Integrations
        </h2>
        <p className="text-sm text-slate-500 mt-1">Connected systems and data pipelines</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DataSourceCard
          name="Stripe"
          icon={<CreditCard className="w-5 h-5 text-violet-600" />}
          status="active"
          lastSync="2m ago"
          rows="15,847"
          iconColor="bg-violet-50"
        />
        <DataSourceCard
          name="Shopify"
          icon={<ShoppingBag className="w-5 h-5 text-emerald-600" />}
          status="active"
          lastSync="5m ago"
          rows="8,234"
          iconColor="bg-emerald-50"
        />
        <DataSourceCard
          name="PostgreSQL"
          icon={<Database className="w-5 h-5 text-blue-600" />}
          status="syncing"
          lastSync="Just now"
          rows="142,456"
          iconColor="bg-blue-50"
        />
        <DataSourceCard
          name="Webhooks API"
          icon={<Zap className="w-5 h-5 text-amber-600" />}
          status="active"
          lastSync="1m ago"
          rows="3,421"
          iconColor="bg-amber-50"
        />
      </div>
    </div>
  );
}
