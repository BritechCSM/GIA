import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface KPICardProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

function KPICard({ title, value, trend, icon, iconBgColor, iconColor }: KPICardProps) {
  const isPositive = trend >= 0;

  return (
    <Card className="rounded-xl shadow-sm border-slate-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Satoshi' }}>
              {value}
            </h3>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{trend}%
              </span>
              <span className="text-xs text-slate-400 ml-1">vs last month</span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Revenue"
        value="€1,240,563"
        trend={12.5}
        icon={<DollarSign className="w-6 h-6" />}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
      />
      <KPICard
        title="Total Orders"
        value="1,247"
        trend={8.2}
        icon={<ShoppingCart className="w-6 h-6" />}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />
      <KPICard
        title="Inventory Value"
        value="€86,420"
        trend={-3.1}
        icon={<Package className="w-6 h-6" />}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
      />
      <KPICard
        title="Active Customers"
        value="2,847"
        trend={15.7}
        icon={<Users className="w-6 h-6" />}
        iconBgColor="bg-violet-50"
        iconColor="text-violet-600"
      />
    </div>
  );
}
