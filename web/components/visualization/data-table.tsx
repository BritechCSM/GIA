import React from 'react';
import { cn } from '@/lib/utils';

type TableRowData = Record<string, string | number | boolean | null>;

interface DataTableProps {
    data: TableRowData[];
    title?: string;
    className?: string;
}

export function DataTable({ data, title, className }: DataTableProps) {
    if (!data || data.length === 0) return null;

    const headers = Object.keys(data[0]);

    return (
        <div className={cn("w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800", className)}>
            {title && (
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                        <tr>
                            {headers.map((header) => (
                                <th key={header} scope="col" className="px-6 py-3 font-medium tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr
                                key={i}
                                className="bg-white border-b dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                {headers.map((header) => (
                                    <td key={`${i}-${header}`} className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                                        {row[header]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-slate-50 px-4 py-2 text-xs text-slate-400 border-t border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                {data.length} rows returned
            </div>
        </div>
    );
}
