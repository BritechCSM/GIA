import { FileText, Download, Eye, Calendar, Trash2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Report {
  id: string;
  name: string;
  description: string;
  format: 'PDF' | 'CSV' | 'Excel';
  generatedDate: string;
  size: string;
  category: 'Ventas' | 'Clientes' | 'Inventario' | 'Finanzas';
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Informe de Ventas Enero 2026',
    description: 'Análisis completo de ventas del mes de enero',
    format: 'PDF',
    generatedDate: '30/01/2026',
    size: '2.4 MB',
    category: 'Ventas',
  },
  {
    id: '2',
    name: 'Exportación Clientes Activos',
    description: 'Lista completa de clientes con actividad en 2025',
    format: 'CSV',
    generatedDate: '28/01/2026',
    size: '856 KB',
    category: 'Clientes',
  },
  {
    id: '3',
    name: 'Balance Financiero Q4 2025',
    description: 'Resumen financiero del cuarto trimestre',
    format: 'Excel',
    generatedDate: '15/01/2026',
    size: '1.2 MB',
    category: 'Finanzas',
  },
  {
    id: '4',
    name: 'Inventario Actual',
    description: 'Estado del inventario a fecha de hoy',
    format: 'CSV',
    generatedDate: '30/01/2026',
    size: '420 KB',
    category: 'Inventario',
  },
  {
    id: '5',
    name: 'Top Productos 2025',
    description: 'Ranking de productos más vendidos del año',
    format: 'PDF',
    generatedDate: '20/01/2026',
    size: '1.8 MB',
    category: 'Ventas',
  },
];

const formatColors = {
  PDF: 'bg-red-100 text-red-700',
  CSV: 'bg-green-100 text-green-700',
  Excel: 'bg-emerald-100 text-emerald-700',
};

const categoryColors = {
  Ventas: 'bg-violet-100 text-violet-700',
  Clientes: 'bg-blue-100 text-blue-700',
  Inventario: 'bg-emerald-100 text-emerald-700',
  Finanzas: 'bg-amber-100 text-amber-700',
};

function ReportCard({ report }: { report: Report }) {
  return (
    <Card className="rounded-xl shadow-sm border-slate-200 hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 mb-1 truncate" style={{ fontFamily: 'Satoshi' }}>
              {report.name}
            </h4>
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {report.description}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <Badge className={formatColors[report.format]}>
                {report.format}
              </Badge>
              <Badge className={categoryColors[report.category]}>
                {report.category}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {report.generatedDate}
              </span>
              <span>{report.size}</span>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 gap-1"
              >
                <Eye className="w-3 h-3" />
                Ver
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-violet-900 hover:bg-violet-800 gap-1"
              >
                <Download className="w-3 h-3" />
                Descargar
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-red-600">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportsView() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Satoshi' }}>
            Informes Generados
          </h2>
          <p className="text-slate-500">
            Accede a todos los informes y exportaciones generadas
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Informes</p>
                <p className="text-2xl font-semibold text-slate-900" style={{ fontFamily: 'Satoshi' }}>
                  {mockReports.length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-violet-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Este Mes</p>
                <p className="text-2xl font-semibold text-violet-600" style={{ fontFamily: 'Satoshi' }}>
                  {mockReports.filter(r => r.generatedDate.includes('/01/2026')).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-violet-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Formato Principal</p>
                <p className="text-base font-semibold text-slate-900" style={{ fontFamily: 'Satoshi' }}>
                  PDF
                </p>
              </div>
              <FileText className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Tamaño Total</p>
                <p className="text-2xl font-semibold text-slate-900" style={{ fontFamily: 'Satoshi' }}>
                  6.6 MB
                </p>
              </div>
              <Download className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
