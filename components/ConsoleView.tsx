import { useState } from 'react';
import { Download, Filter, BarChart3, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';

// Mock data for demonstration
const mockQueryResult = {
  query: "Dame la lista de clientes con más ventas en 2025",
  timestamp: new Date(),
  rowCount: 15,
  data: [
    { id: 1, nombre: "Ferretería García S.L.", totalGasto: "€45,230", ultimoPedido: "15/01/2026", pedidos: 23 },
    { id: 2, nombre: "Construcciones López", totalGasto: "€38,450", ultimoPedido: "28/01/2026", pedidos: 18 },
    { id: 3, nombre: "Almacenes Rodríguez", totalGasto: "€32,100", ultimoPedido: "22/01/2026", pedidos: 15 },
    { id: 4, nombre: "Materiales Sánchez", totalGasto: "€28,900", ultimoPedido: "10/01/2026", pedidos: 12 },
    { id: 5, nombre: "Distribuciones Martínez", totalGasto: "€25,670", ultimoPedido: "30/01/2026", pedidos: 14 },
    { id: 6, nombre: "Suministros Fernández", totalGasto: "€22,340", ultimoPedido: "18/01/2026", pedidos: 11 },
    { id: 7, nombre: "Comercial Pérez", totalGasto: "€19,800", ultimoPedido: "25/01/2026", pedidos: 9 },
    { id: 8, nombre: "Grupo Industrial Gómez", totalGasto: "€17,450", ultimoPedido: "12/01/2026", pedidos: 8 },
  ],
};

export function ConsoleView() {
  const [hasResults, setHasResults] = useState(true);

  if (!hasResults) {
    // ... (Initial state remains the same)
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-violet-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Satoshi' }}>
            Lista para consultar
          </h2>
          <p className="text-slate-500 mb-6">
            Utiliza el asistente Gia para hacer preguntas sobre tus datos.
            Por ejemplo: "Dame las ventas del mes" o "Muéstrame los clientes principales".
          </p>
          <Button
            className="bg-gradient-to-r from-violet-900 to-violet-700 hover:from-violet-800 hover:to-violet-600 shadow-lg shadow-violet-200"
            onClick={() => setHasResults(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Iniciar con Gia
          </Button>
        </div>
      </div>
    );
  }

  // Enhanced Mock Data (ClassicGes Context)
  const enrichedData = [
    { id: 1, nombre: "Construcciones y Reformas S.L.", nif: "B12345678", sector: "Obras", trend: "up", change: "+12%", totalGasto: "€45,230", barValue: 100 },
    { id: 2, nombre: "Ferretería Industrial del Norte", nif: "A87654321", sector: "Suministros", trend: "down", change: "-5%", totalGasto: "€38,450", barValue: 85 },
    { id: 3, nombre: "Talleres Mecánicos Gomez", nif: "B11223344", sector: "Automoción", trend: "up", change: "+8%", totalGasto: "€32,100", barValue: 70 },
    { id: 4, nombre: "Distribuidora de Alimentación", nif: "A44332211", sector: "Horeca", trend: "stable", change: "0%", totalGasto: "€28,900", barValue: 62 },
    { id: 5, nombre: "Logística y Transportes Rápidos", nif: "B99887766", sector: "Servicios", trend: "up", change: "+15%", totalGasto: "€25,670", barValue: 55 },
    { id: 6, nombre: "Hotel Playa Azul", nif: "A55667788", sector: "Hostelería", trend: "down", change: "-2%", totalGasto: "€22,340", barValue: 48 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden rounded-3xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">Total Facturado</p>
                <h3 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Satoshi' }}>€192,800</h3>
                <span className="text-[10px] font-bold text-emerald-600 inline-flex items-center gap-1 mt-2 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ▲ +5.2% vs mes anterior
                </span>
              </div>
              <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden rounded-3xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">Crecimiento Anual</p>
                <h3 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Satoshi' }}>+12.4%</h3>
                <span className="text-[10px] font-bold text-slate-500 inline-flex items-center gap-1 mt-2 bg-slate-50 px-2 py-0.5 rounded-full">
                  Basado en últimos 12 meses
                </span>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Proyectado Q1</p>
                <h3 className="text-2xl font-black text-slate-800" style={{ fontFamily: 'Satoshi' }}>€245k</h3>
                <span className="text-[10px] font-bold text-violet-600 inline-flex items-center gap-1 mt-2 bg-violet-50 px-2 py-0.5 rounded-full">
                  Predicción Inteligente de Gia
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Enhanced Table */}
      <Card className="rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-slate-100 overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-200 bg-slate-50/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                <BarChart3 className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-800" style={{ fontFamily: 'Satoshi' }}>
                  Top Clientes por Volumen de Ventas
                </CardTitle>
                <p className="text-xs text-slate-500 font-medium">Ordenado por facturación total (YYYY-MM)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-2 bg-white hover:border-violet-200 hover:text-violet-600">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs">Filtrar</span>
              </Button>
              <Button size="sm" className="h-8 gap-2 bg-slate-900 text-white hover:bg-slate-800">
                <Download className="w-3.5 h-3.5" />
                <span className="text-xs">Exportar</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="w-12 text-center text-xs uppercase tracking-wider font-semibold text-slate-500">#</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-semibold text-slate-500">Cliente</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-semibold text-slate-500">Sector</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-semibold text-slate-500">Tendencia</TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wider font-semibold text-slate-500 w-[200px]">Total Facturado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrichedData.map((row) => (
                  <TableRow key={row.id} className="group hover:bg-violet-50/30 transition-colors">
                    <TableCell className="text-center font-medium text-slate-400 text-xs py-4">
                      {row.id}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700 py-4">
                      {row.nombre}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-200/60 font-medium text-[10px]">
                        {row.sector}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${row.trend === 'up' ? 'text-emerald-600' :
                        row.trend === 'down' ? 'text-red-500' : 'text-slate-500'
                        }`}>
                        {row.change}
                        {row.trend === 'up' && <span className="bg-emerald-100 text-emerald-700 px-1 rounded text-[9px]">▲</span>}
                        {row.trend === 'down' && <span className="bg-red-100 text-red-700 px-1 rounded text-[9px]">▼</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-bold text-slate-800">{row.totalGasto}</span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-600 rounded-full"
                            style={{ width: `${row.barValue}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center pt-4">
        <Button
          variant="ghost"
          className="text-slate-500 hover:text-violet-600 hover:bg-transparent -mt-2 text-xs"
          onClick={() => setHasResults(false)}
        >
          Limpiar vista
        </Button>
      </div>
    </div>
  );
}
