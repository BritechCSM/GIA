'use client'

import { useState } from 'react'
import { register } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react'

export function RegisterForm() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        try {
            const result = await register(formData)
            if (!result.success) {
                setError(result.error)
            }
        } catch (err) {
            setError('Error inesperado. Inténtalo de nuevo.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-5">
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-300">Nombre completo</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Tu nombre"
                        required
                        disabled={isLoading}
                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="organizationName" className="text-slate-300">Nombre de empresa</Label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                        id="organizationName"
                        name="organizationName"
                        type="text"
                        placeholder="Tu empresa"
                        required
                        disabled={isLoading}
                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        disabled={isLoading}
                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        required
                        disabled={isLoading}
                        className="pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2.5"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creando cuenta...
                    </>
                ) : (
                    'Crear cuenta'
                )}
            </Button>
        </form>
    )
}
