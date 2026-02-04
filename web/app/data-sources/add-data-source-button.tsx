'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createDataSource } from '@/lib/actions/data-sources'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Loader2, Database } from 'lucide-react'

const dbTypes = [
    { value: 'postgresql', label: 'PostgreSQL', icon: '🐘', defaultPort: 5432 },
    { value: 'mysql', label: 'MySQL', icon: '🐬', defaultPort: 3306 },
    { value: 'sqlserver', label: 'SQL Server', icon: '🔷', defaultPort: 1433 },
    { value: 'oracle', label: 'Oracle', icon: '🔴', defaultPort: 1521 },
]

export function AddDataSourceButton() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<string>('')
    const router = useRouter()

    const selectedDb = dbTypes.find(db => db.value === selectedType)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        try {
            const result = await createDataSource(formData)
            if (result.success) {
                setOpen(false)
                router.refresh()
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError('Error inesperado. Inténtalo de nuevo.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva conexión
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle>Nueva fuente de datos</DialogTitle>
                            <DialogDescription>
                                Conecta una base de datos externa
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4 mt-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Mi base de datos"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción (opcional)</Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="Base de datos de producción"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <Label>Tipo de base de datos</Label>
                        <Select
                            name="type"
                            required
                            onValueChange={setSelectedType}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {dbTypes.map(db => (
                                    <SelectItem key={db.value} value={db.value}>
                                        <span className="flex items-center gap-2">
                                            <span>{db.icon}</span>
                                            <span>{db.label}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Connection details */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="host">Host</Label>
                            <Input
                                id="host"
                                name="host"
                                placeholder="localhost"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="port">Puerto</Label>
                            <Input
                                id="port"
                                name="port"
                                type="number"
                                placeholder={selectedDb?.defaultPort?.toString() || '5432'}
                                defaultValue={selectedDb?.defaultPort}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="database">Base de datos</Label>
                        <Input
                            id="database"
                            name="database"
                            placeholder="nombre_base_datos"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="username">Usuario</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="usuario"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <input type="hidden" name="ssl" value="false" />

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Conectando...
                                </>
                            ) : (
                                'Conectar'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
