import { getDataSources } from '@/lib/actions/data-sources'
import { DataSourceCard } from './data-source-card'
import { Database } from 'lucide-react'

interface DataSource {
    id: string;
    name: string;
    description?: string;
    type: string;
    status: string;
    last_sync_at?: string;
    created_at: string;
}

export async function DataSourcesList() {
    const result = await getDataSources()

    if (!result.success) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600">{result.error}</p>
            </div>
        )
    }

    const dataSources = (result.data || []) as DataSource[]

    if (dataSources.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <Database className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    No hay fuentes de datos
                </h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Conecta tu primera base de datos para comenzar a analizar tus datos con IA.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dataSources.map((ds) => (
                <DataSourceCard key={ds.id} dataSource={ds} />
            ))}
        </div>
    )
}
