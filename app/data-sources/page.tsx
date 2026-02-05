import { Suspense } from 'react'
import { DataSourcesList } from './data-sources-list'
import { AddDataSourceButton } from './add-data-source-button'
import { Database, Loader2 } from 'lucide-react'

export default function DataSourcesPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Fuentes de Datos</h1>
                            <p className="text-sm text-slate-500">Conecta y gestiona tus bases de datos</p>
                        </div>
                    </div>
                    <AddDataSourceButton />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto p-6">
                <Suspense fallback={
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        <span className="ml-3 text-slate-500">Cargando fuentes de datos...</span>
                    </div>
                }>
                    <DataSourcesList />
                </Suspense>
            </div>
        </div>
    )
}
