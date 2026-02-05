'use client'

import { useState } from 'react'
import { testDataSourceConnection, deleteDataSource } from '@/lib/actions/data-sources'
import {
    Database,
    MoreVertical,
    Plug,
    Trash2,
    CheckCircle2,
    XCircle,
    Clock,
    Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const typeIcons: Record<string, string> = {
    postgresql: '🐘',
    mysql: '🐬',
    sqlserver: '🔷',
    oracle: '🔴',
    api: '🔌',
    csv: '📄',
}

const typeLabels: Record<string, string> = {
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
    sqlserver: 'SQL Server',
    oracle: 'Oracle',
    api: 'API REST',
    csv: 'Archivo CSV',
}

const statusConfig = {
    connected: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', label: 'Conectado' },
    error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Error' },
    pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Pendiente' },
    disabled: { icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-50', label: 'Deshabilitado' },
}

interface DataSourceCardProps {
    dataSource: {
        id: string
        name: string
        description?: string
        type: string
        status: string
        last_sync_at?: string
        created_at: string
    }
}

export function DataSourceCard({ dataSource }: DataSourceCardProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [actionType, setActionType] = useState<'test' | 'delete' | null>(null)

    const status = statusConfig[dataSource.status as keyof typeof statusConfig] || statusConfig.pending
    const StatusIcon = status.icon

    async function handleTest() {
        setIsLoading(true)
        setActionType('test')
        try {
            await testDataSourceConnection(dataSource.id)
        } finally {
            setIsLoading(false)
            setActionType(null)
        }
    }

    async function handleDelete() {
        if (!confirm('¿Estás seguro de eliminar esta fuente de datos?')) return

        setIsLoading(true)
        setActionType('delete')
        try {
            await deleteDataSource(dataSource.id)
        } finally {
            setIsLoading(false)
            setActionType(null)
        }
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                        {typeIcons[dataSource.type] || '📊'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">{dataSource.name}</h3>
                        <p className="text-sm text-slate-500">{typeLabels[dataSource.type] || dataSource.type}</p>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleTest} disabled={isLoading}>
                            <Plug className="w-4 h-4 mr-2" />
                            Probar conexión
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Description */}
            {dataSource.description && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{dataSource.description}</p>
            )}

            {/* Status */}
            <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {isLoading && actionType === 'test' ? (
                        <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Probando...
                        </>
                    ) : (
                        status.label
                    )}
                </div>

                {dataSource.last_sync_at && (
                    <span className="text-xs text-slate-400">
                        Sync: {new Date(dataSource.last_sync_at).toLocaleDateString()}
                    </span>
                )}
            </div>
        </div>
    )
}
