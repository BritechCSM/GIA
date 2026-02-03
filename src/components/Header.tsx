import { Search, Bell, User, Building2 } from 'lucide-react';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

interface HeaderProps {
  currentView: 'console' | 'connections' | 'queries' | 'reports';
}

const viewTitles = {
  console: 'Consola de Análisis',
  connections: 'Conexiones de Datos',
  queries: 'Consultas Guardadas',
  reports: 'Informes'
};

export function Header({ currentView }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Left: Project Context */}
      <div className="flex items-center gap-3">
        <Building2 className="w-5 h-5 text-violet-600" />
        <div>
          <h2 className="text-sm font-semibold text-slate-800" style={{ fontFamily: 'Satoshi' }}>
            Proyecto: AIG Classic S.L.
          </h2>
          <span className="text-xs text-slate-500">{viewTitles[currentView]}</span>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar consultas, tablas..."
            className="pl-10 bg-slate-50 border-slate-200 focus:border-violet-300 focus:ring-violet-300"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button className="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
          </button>
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            2
          </Badge>
        </div>

        {/* User Profile */}
        <Avatar className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 cursor-pointer">
          <AvatarFallback className="bg-transparent text-white font-semibold">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
