import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { navGroups, ViewType } from '@/lib/nav-data';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ collapsed, onToggleCollapse, currentView, onViewChange }: SidebarProps) {
  return (
    <aside
      className={`bg-white border-r border-slate-100 hidden md:flex flex-col transition-all duration-300 relative ${collapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Brand Header */}
      <div className="h-24 flex items-center px-8 border-b border-slate-50/80 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/10 border border-white/10 transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-black text-2xl font-satoshi translate-y-[-1px]">G</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white shadow-sm" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="font-black text-xl tracking-tight text-slate-900 leading-none font-satoshi">
                GIA
              </h1>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mt-2">
                Data Analyst
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 py-4 px-4 space-y-10 overflow-y-auto no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-3">
            {!collapsed && (
              <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/80">
                {group.label}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${currentView === item.id
                    ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/25 scale-[1.02]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    } ${collapsed ? 'justify-center px-2' : ''}`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 transition-colors duration-300 ${currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {!collapsed && <span className="text-[13px] font-bold tracking-tight">{item.label}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 space-y-4 border-t border-slate-100">
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center justify-center p-2 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all border border-transparent ${collapsed ? 'h-12' : 'h-10'}`}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span className="text-[11px] font-bold ml-2 uppercase tracking-wider">Contraer Menú</span>}
        </button>
      </div>
    </aside>
  );
}
