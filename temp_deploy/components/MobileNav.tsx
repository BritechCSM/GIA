import { Menu, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { navGroups, ViewType } from '@/lib/nav-data';
import { useState } from 'react';

interface MobileNavProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

export function MobileNav({ currentView, onViewChange }: MobileNavProps) {
    const [open, setOpen] = useState(false);

    const handleViewChange = (view: ViewType) => {
        onViewChange(view);
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <div className="sr-only">
                    <SheetTitle>Menú de Navegación</SheetTitle>
                    <SheetDescription>Navegación principal de la aplicación</SheetDescription>
                </div>

                {/* Mobile Header */}
                <div className="h-24 flex items-center px-6 border-b border-slate-100 mb-6 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/10 border border-white/10">
                                <span className="text-white font-black text-xl font-satoshi translate-y-[-1px]">G</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-black text-lg tracking-tight text-slate-900 leading-none font-satoshi">
                                GIA
                            </h1>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mt-1">
                                Data Analyst
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="px-4 space-y-8 overflow-y-auto no-scrollbar h-[calc(100vh-100px)]">
                    {navGroups.map((group) => (
                        <div key={group.label} className="space-y-3">
                            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/80">
                                {group.label}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleViewChange(item.id)}
                                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${currentView === item.id
                                            ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/25 scale-[1.02]'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 shrink-0 transition-colors duration-300 ${currentView === item.id ? 'text-white' : 'text-slate-400'}`} />
                                        <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
