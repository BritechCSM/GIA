import {
    LayoutDashboard,
    Database,
    Link2,
    Settings,
    FileText
} from 'lucide-react';

export type ViewType = 'console' | 'settings' | 'queries' | 'reports';

export interface NavItem {
    id: ViewType;
    label: string;
    icon: React.ElementType;
}

export interface NavGroup {
    label: string;
    items: NavItem[];
}

export const viewTitles: Record<ViewType, string> = {
    console: 'Consola de Análisis',
    settings: 'Ajustes',
    queries: 'Consultas Guardadas',
    reports: 'Informes'
};

export const navGroups: NavGroup[] = [
    {
        label: "General",
        items: [
            { id: 'console', label: 'Consola de Análisis', icon: LayoutDashboard },
            { id: 'queries', label: 'Consultas Guardadas', icon: Database },
            { id: 'reports', label: 'Informes de IA', icon: FileText },
        ]
    },
    {
        label: "Configuración",
        items: [
            { id: 'settings', label: 'Ajustes', icon: Settings },
        ]
    }
];
