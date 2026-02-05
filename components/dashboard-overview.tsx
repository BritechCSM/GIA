"use client";

import React from 'react';
import { ChartRenderer } from './visualization/chart-renderer';
import { DataTable } from './visualization/data-table';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data
const REVENUE_DATA = [
    { month: 'Ago', amount: 42000 },
    { month: 'Sep', amount: 48000 },
    { month: 'Oct', amount: 51000 },
    { month: 'Nov', amount: 49000 },
    { month: 'Dic', amount: 65000 },
    { month: 'Ene', amount: 58000 },
];

const RECENT_TXS = [
    { ID: '#TX-9821', Client: 'Global Tech', Date: '2026-01-28', Amount: '€4,500', Status: 'Completed' },
    { ID: '#TX-9822', Client: 'Hotel California', Date: '2026-01-28', Amount: '€1,200', Status: 'Pending' },
    { ID: '#TX-9823', Client: 'Consultora Y', Date: '2026-01-27', Amount: '€850', Status: 'Completed' },
    { ID: '#TX-9824', Client: 'Logistica Norte', Date: '2026-01-27', Amount: '€12,000', Status: 'Completed' },
    { ID: '#TX-9825', Client: 'Startup Z', Date: '2026-01-26', Amount: '€2,100', Status: 'Failed' },
];

interface KpiCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    trend: 'up' | 'down';
}

function KpiCard({ title, value, change, icon: Icon, trend }: KpiCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
                    <Icon className="w-5 h-5" />
                </div>
                <div className={cn(
                    "flex items-center text-xs font-semibold px-2 py-1 rounded-full",
                    trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {change}
                </div>
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            </div>
        </div>
    )
}

export function DashboardOverview() {
    return (
        <div className="space-y-6 w-full pb-24">

            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Resumen Ejecutivo</h2>
                    <p className="text-slate-500">Vista general del rendimiento de AIG Classic S.L.</p>
                </div>
                <div className="text-sm text-slate-400">
                    Última actualización: hace 5 minutos
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Ingresos Totales (Mes)" value="€58,000" change="+12.5%" icon={DollarSign} trend="up" />
                <KpiCard title="Usuarios Activos" value="2,450" change="+5.2%" icon={Users} trend="up" />
                <KpiCard title="Nuevos Pedidos" value="342" change="-2.1%" icon={ShoppingCart} trend="down" />
                <KpiCard title="tasa de Retención" value="94.5%" change="+0.8%" icon={Activity} trend="up" />
            </div>

            {/* Charts & Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2">
                    <ChartRenderer
                        title="Tendencia de Ingresos (6 Meses)"
                        type="area"
                        data={REVENUE_DATA}
                        xKey="month"
                        dataKey="amount"
                        className="h-full"
                    />
                </div>

                {/* Side Stats / Activity */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-slate-800 mb-4">Actividad Reciente</h3>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="w-2 h-2 mt-2 rounded-full bg-brand-violet shrink-0" />
                                <div>
                                    <p className="text-sm text-slate-700 font-medium">Nuevo usuario registrado</p>
                                    <p className="text-xs text-slate-400">Hace {10 + i * 5} minutos &bull; Vía Web</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div>
                <DataTable
                    title="Últimas Transacciones"
                    data={RECENT_TXS}
                    className="border-slate-200 shadow-sm"
                />
            </div>
        </div>
    );
}
