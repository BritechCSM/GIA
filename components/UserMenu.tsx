'use client'

import { useState } from 'react'
import { User, LogOut, Settings, Building2, ChevronDown } from 'lucide-react'
import { logout } from '@/lib/actions/auth'
import { Avatar, AvatarFallback } from './ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface UserMenuProps {
    user?: {
        email?: string
        fullName?: string
    }
    organization?: {
        name?: string
    }
}

export function UserMenu({ user, organization }: UserMenuProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    async function handleLogout() {
        setIsLoggingOut(true)
        try {
            await logout()
        } catch (error) {
            console.error('Logout error:', error)
            setIsLoggingOut(false)
        }
    }

    const initials = user?.fullName
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                    <Avatar className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600">
                        <AvatarFallback className="bg-transparent text-white font-semibold text-sm">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                            {user?.fullName || user?.email || 'Usuario'}
                        </p>
                        <p className="text-xs text-slate-400 truncate max-w-[120px]">
                            {organization?.name || 'Sin organización'}
                        </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.fullName || 'Usuario'}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {organization && (
                    <>
                        <DropdownMenuItem disabled>
                            <Building2 className="mr-2 h-4 w-4" />
                            <span className="truncate">{organization.name}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
