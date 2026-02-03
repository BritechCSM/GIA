import { useState } from 'react';
import { Download, Filter, BarChart3, Sparkles } from 'lucide-react';
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
  const [hasResults, setHasResults] = useState(true); // Set to true to show example data

  if (!hasResults) {
    // State Zero - No query yet
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
            className="bg-gradient-to-r from-violet-900 to-violet-700 hover:from-violet-800 hover:to-violet-600"
            onClick={() => setHasResults(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Iniciar con Gia
          </Button>
        </div>
      </div>
    );
  }

  // Active State - Showing query results
  return (
    <div className="p-6 space-y-6">
      {/* Query Info Bar */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-xs font-medium text-violet-700 uppercase tracking-wide">
                Consulta ejecutada por Gia
              </span>
            </div>
            <p className="text-sm font-medium text-slate-900 mb-1">
              "{mockQueryResult.query}"
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span>
                {mockQueryResult.timestamp.toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>•</span>
              <span>{mockQueryResult.rowCount} resultados</span>
              <span>•</span>
              <span>Base de datos: Production DB</span>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Completado
          </Badge>
        </div>
      </div>

      {/* Results Table */}
      <Card className="rounded-xl shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg" style={{ fontFamily: 'Satoshi' }}>
              Clientes Principales 2025
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Visualizar
              </Button>
              <Button 
                size="sm" 
                className="gap-2 bg-violet-900 hover:bg-violet-800"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nombre del Cliente</TableHead>
                  <TableHead className="text-right">Total Gastado</TableHead>
                  <TableHead className="text-right">Último Pedido</TableHead>
                  <TableHead className="text-right">Nº Pedidos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockQueryResult.data.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-500">
                      {row.id}
                    </TableCell>
                    <TableCell className="font-medium">{row.nombre}</TableCell>
                    <TableCell className="text-right font-semibold text-violet-900">
                      {row.totalGasto}
                    </TableCell>
                    <TableCell className="text-right text-slate-600">
                      {row.ultimoPedido}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{row.pedidos}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <Button 
          variant="outline"
          className="gap-2 border-violet-200 text-violet-900 hover:bg-violet-50"
          onClick={() => setHasResults(false)}
        >
          <Sparkles className="w-4 h-4" />
          Nueva Consulta con Gia
        </Button>
      </div>
    </div>
  );
}
