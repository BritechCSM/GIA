import { useState } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  BookmarkCheck, 
  FileText, 
  ChevronLeft,
  Crown
} from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentView: 'console' | 'connections' | 'queries' | 'reports';
  onViewChange: (view: 'console' | 'connections' | 'queries' | 'reports') => void;
}

interface MenuItem {
  id: 'console' | 'connections' | 'queries' | 'reports';
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { id: 'console', label: 'Consola de Análisis', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'connections', label: 'Conexiones de Datos', icon: <Database className="w-5 h-5" /> },
  { id: 'queries', label: 'Consultas Guardadas', icon: <BookmarkCheck className="w-5 h-5" /> },
  { id: 'reports', label: 'Informes', icon: <FileText className="w-5 h-5" /> },
];

export function Sidebar({ collapsed, onToggleCollapse, currentView, onViewChange }: SidebarProps) {
  return (
    <aside 
      className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-900 to-violet-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">G</span>
            </div>
            <h1 className="font-black text-xl tracking-tight" style={{ fontFamily: 'Satoshi' }}>
              GIA
            </h1>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-violet-900 to-violet-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-lg">G</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              currentView === item.id
                ? 'bg-violet-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            } ${collapsed ? 'justify-center' : ''}`}
          >
            {item.icon}
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 space-y-2 border-t border-slate-200">
        {!collapsed && (
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 border-violet-200 text-violet-900 hover:bg-violet-50"
          >
            <Crown className="w-4 h-4" />
            Mejorar Plan
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-full justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span className="ml-2">Minimizar Menú</span>}
        </Button>
      </div>
    </aside>
  );
}
