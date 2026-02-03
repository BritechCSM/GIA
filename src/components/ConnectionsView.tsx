import { Database, AlertCircle, CheckCircle2, Plus, Settings, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'PostgreSQL' | 'MySQL' | 'MongoDB' | 'SQL Server';
  status: 'connected' | 'error' | 'disconnected';
  host: string;
  database: string;
  lastSync?: string;
  tables?: number;
}

const mockConnections: DatabaseConnection[] = [
  {
    id: '1',
    name: 'Base de Datos de Producción',
    type: 'PostgreSQL',
    status: 'connected',
    host: 'prod-db.aigclassic.com',
    database: 'sales_production',
    lastSync: 'Hace 2 minutos',
    tables: 45,
  },
  {
    id: '2',
    name: 'CRM Heredado',
    type: 'MySQL',
    status: 'error',
    host: 'legacy-crm.local',
    database: 'crm_2020',
    lastSync: 'Hace 2 horas',
    tables: 28,
  },
  {
    id: '3',
    name: 'Base de Datos de Almacén',
    type: 'PostgreSQL',
    status: 'connected',
    host: 'warehouse-db.aigclassic.com',
    database: 'inventory',
    lastSync: 'Hace 5 minutos',
    tables: 18,
  },
  {
    id: '4',
    name: 'Analytics MongoDB',
    type: 'MongoDB',
    status: 'disconnected',
    host: 'analytics.mongo.aigclassic.com',
    database: 'analytics',
    tables: 12,
  },
];

const statusConfig = {
  connected: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: 'Conectado',
    badgeClass: 'bg-green-100 text-green-700 hover:bg-green-100',
    borderClass: 'border-green-200',
  },
  error: {
    icon: <AlertCircle className="w-4 h-4" />,
    label: 'Error',
    badgeClass: 'bg-red-100 text-red-700 hover:bg-red-100',
    borderClass: 'border-red-200',
  },
  disconnected: {
    icon: <Database className="w-4 h-4" />,
    label: 'Desconectado',
    badgeClass: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
    borderClass: 'border-slate-200',
  },
};

const typeColors = {
  PostgreSQL: 'bg-blue-100 text-blue-700',
  MySQL: 'bg-amber-100 text-amber-700',
  MongoDB: 'bg-emerald-100 text-emerald-700',
  'SQL Server': 'bg-violet-100 text-violet-700',
};

function ConnectionCard({ connection }: { connection: DatabaseConnection }) {
  const config = statusConfig[connection.status];

  return (
    <Card className={`rounded-xl shadow-sm hover:shadow-md transition-all border-2 ${config.borderClass}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge className={typeColors[connection.type]}>
            {connection.type}
          </Badge>
          <Badge className={config.badgeClass}>
            <span className="flex items-center gap-1">
              {config.icon}
              {config.label}
            </span>
          </Badge>
        </div>
        <CardTitle className="text-lg" style={{ fontFamily: 'Satoshi' }}>
          {connection.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Host:</span>
            <span className="text-slate-900 font-mono text-xs">{connection.host}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Base de datos:</span>
            <span className="text-slate-900 font-medium">{connection.database}</span>
          </div>
          {connection.tables && (
            <div className="flex justify-between">
              <span className="text-slate-500">Tablas:</span>
              <span className="text-slate-900 font-medium">{connection.tables}</span>
            </div>
          )}
          {connection.lastSync && (
            <div className="flex justify-between">
              <span className="text-slate-500">Última sincronización:</span>
              <span className="text-slate-900 font-medium">{connection.lastSync}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <Settings className="w-3 h-3" />
            Configurar
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConnectionsView() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Satoshi' }}>
            Conexiones de Datos
          </h2>
          <p className="text-slate-500">
            Gestiona las conexiones a tus bases de datos y sistemas externos
          </p>
        </div>
        <Button className="gap-2 bg-violet-900 hover:bg-violet-800">
          <Plus className="w-4 h-4" />
          Nueva Conexión
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Conexiones</p>
                <p className="text-2xl font-semibold text-slate-900" style={{ fontFamily: 'Satoshi' }}>
                  {mockConnections.length}
                </p>
              </div>
              <Database className="w-8 h-8 text-violet-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Activas</p>
                <p className="text-2xl font-semibold text-green-600" style={{ fontFamily: 'Satoshi' }}>
                  {mockConnections.filter(c => c.status === 'connected').length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Con Errores</p>
                <p className="text-2xl font-semibold text-red-600" style={{ fontFamily: 'Satoshi' }}>
                  {mockConnections.filter(c => c.status === 'error').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Tablas</p>
                <p className="text-2xl font-semibold text-slate-900" style={{ fontFamily: 'Satoshi' }}>
                  {mockConnections.reduce((sum, c) => sum + (c.tables || 0), 0)}
                </p>
              </div>
              <Database className="w-8 h-8 text-slate-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockConnections.map((connection) => (
          <ConnectionCard key={connection.id} connection={connection} />
        ))}
      </div>
    </div>
  );
}
