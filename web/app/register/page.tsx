import { RegisterForm } from './register-form'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-4xl font-bold text-white">GIA</h1>
                    <p className="text-slate-400 mt-2">Gestión Inteligente con IA</p>
                </div>

                {/* Form Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
                    <h2 className="text-xl font-semibold text-white mb-6">Crear cuenta</h2>
                    <RegisterForm />

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            ¿Ya tienes cuenta?{' '}
                            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-8">
                    © {new Date().getFullYear()} Britech LLC. Todos los derechos reservados.
                </p>
            </div>
        </div>
    )
}
