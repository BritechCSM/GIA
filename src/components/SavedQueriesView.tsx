import { BookmarkCheck, Clock, Play, Trash2, Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SavedQuery {
  id: string;
  name: string;
  query: string;
  database: string;
  lastRun?: string;
  runCount: number;
  favorite: boolean;
  category: 'Ventas' | 'Clientes' | 'Inventario' | 'Finanzas';
}

const mockQueries: SavedQuery[] = [
  {
    id: '1',
    name: 'Ventas Mensuales por Cliente',
    query: 'Dame las ventas del último mes agrupadas por cliente',
    database: 'Production DB',
    lastRun: 'Hace 2 horas',
    runCount: 45,
    favorite: true,
    category: 'Ventas',
  },
  {
    id: '2',
    name: 'Top 10 Productos Más Vendidos',
    query: 'Muéstrame los 10 productos con más unidades vendidas este año',
    database: 'Production DB',
    lastRun: 'Hace 1 día',
    runCount: 32,
    favorite: true,
    category: 'Ventas',
  },
  {
    id: '3',
    name: 'Clientes sin Actividad',
    query: 'Lista de clientes que no han hecho pedidos en los últimos 90 días',
    database: 'CRM Heredado',
    lastRun: 'Hace 3 días',
    runCount: 18,
    favorite: false,
    category: 'Clientes',
  },
  {
    id: '4',
    name: 'Stock Bajo Mínimo',
    query: 'Productos con stock por debajo del nivel mínimo',
    database: 'Warehouse DB',
    lastRun: 'Hace 4 horas',
    runCount: 67,
    favorite: true,
    category: 'Inventario',
  },
  {
    id: '5',
    name: 'Facturas Pendientes',
    query: 'Facturas con más de 30 días de antigüedad sin cobrar',
    database: 'Production DB',
    lastRun: 'Hace 1 semana',
    runCount: 12,
    favorite: false,
    category: 'Finanzas',
  },
];

const categoryColors = {
  Ventas: 'bg-violet-100 text-violet-700',
  Clientes: 'bg-blue-100 text-blue-700',
  Inventario: 'bg-emerald-100 text-emerald-700',
  Finanzas: 'bg-amber-100 text-amber-700',
};

function QueryCard({ query }: { query: SavedQuery }) {
  return (
    <Card className="rounded-xl shadow-sm border-slate-200 hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-slate-900" style={{ fontFamily: 'Satoshi' }}>
                {query.name}
              </h4>
              {query.favorite && (
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              )}
            </div>
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              "{query.query}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge className={categoryColors[query.category]}>
            {query.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {query.database}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-4">
            {query.lastRun && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {query.lastRun}
              </span>
            )}
            <span>{query.runCount} ejecuciones</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-violet-900 hover:bg-violet-800 gap-1"
          >
            <Play className="w-3 h-3" />
            Ejecutar
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-red-600">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SavedQueriesView() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Satoshi' }}>
            Consultas Guardadas
          </h2>
          <p className="text-slate-500">
            Accede rápidamente a tus consultas más utilizadas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Star className="w-4 h-4" />
            Solo favoritas
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Consultas</p>
                <p className="text-2xl font-semibold text-slate-900" style={{ fontFamily: 'Satoshi' }}>
                  {mockQueries.length}
                </p>
              </div>
              <BookmarkCheck className="w-8 h-8 text-violet-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Favoritas</p>
                <p className="text-2xl font-semibold text-amber-600" style={{ fontFamily: 'Satoshi' }}>
                  {mockQueries.filter(q => q.favorite).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Más Popular</p>
                <p className="text-base font-semibold text-slate-900 truncate" style={{ fontFamily: 'Satoshi' }}>
                  Stock Bajo
                </p>
              </div>
              <Play className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Ejecuciones</p>
                <p className="text-2xl font-semibold text-slate-900" style={{ fontFamily: 'Satoshi' }}>
                  {mockQueries.reduce((sum, q) => sum + q.runCount, 0)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockQueries.map((query) => (
          <QueryCard key={query.id} query={query} />
        ))}
      </div>
    </div>
  );
}
