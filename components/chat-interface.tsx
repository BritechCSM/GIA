"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, BarChart2, FileText, Download } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { DataTable } from './visualization/data-table';
import { ChartRenderer } from './visualization/chart-renderer';
import { chatWithGia } from '@/lib/actions/gia-chat';

// --- Types ---
type MessageRole = 'user' | 'assistant' | 'system';
type MessageType = 'text' | 'code' | 'visualization';

interface ChartVisualization {
    plotType: 'bar' | 'line' | 'area' | 'table';
    title: string;
    data: Record<string, string | number>[];
    xKey: string;
    dataKey: string;
}

interface Message {
    id: string;
    role: MessageRole;
    content: string;
    type?: MessageType;
    metadata?: ChartVisualization;
    timestamp: Date;
}

// --- Mock Scenarios ---
const SCENARIO_SALES = [
    {
        role: 'assistant',
        content: "Hola! Soy tu Agente de Datos. Estoy conectado a tu base de datos de 'AIG Management'. ¿Qué quieres analizar hoy?",
        type: 'text'
    },
    {
        role: 'user',
        content: "Analiza las ventas de los últimos 6 meses por categoría.",
        type: 'text'
    },
    {
        role: 'assistant',
        content: "Claro, analizando transacciones desde Agosto 2025 hasta Enero 2026...",
        type: 'text'
    },
    {
        role: 'assistant',
        content: "```sql\nSELECT category, SUM(amount) as total_sales, COUNT(*) as tx_count \nFROM sales \nWHERE date >= NOW() - INTERVAL '6 months' \nGROUP BY category \nORDER BY total_sales DESC;\n```",
        type: 'code'
    },
    {
        role: 'assistant',
        content: "Aquí tienes el desglose de ventas. La categoría 'Servicios Cloud' lidera con diferencia.",
        type: 'visualization',
        metadata: {
            plotType: 'bar',
            title: 'Ventas por Categoría (6 Meses)',
            data: [
                { category: 'Cloud Services', sales: 125000 },
                { category: 'Licencias', sales: 85000 },
                { category: 'Consultoría', sales: 65000 },
                { category: 'Hardware', sales: 42000 },
                { category: 'Soporte', sales: 30000 },
            ],
            xKey: 'category',
            dataKey: 'sales'
        }
    }
];

export function ChatInterface() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hola! Soy Gia, tu analista de datos. ¿Qué te gustaría saber hoy?",
            timestamp: new Date(),
            type: 'text'
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
            type: 'text'
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            // Call Edge Function via server action
            const result = await chatWithGia(
                newMessages.map(m => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content
                })),
                'No database connected yet.' // Schema context
            );

            if (result.success && result.response) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + '_ai',
                    role: 'assistant',
                    content: result.response,
                    timestamp: new Date(),
                    type: 'text'
                }]);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: `Lo siento, hubo un error: ${result.error || 'Error desconocido'}`,
                    timestamp: new Date(),
                    type: 'text'
                }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Lo siento, hubo un error al procesar tu solicitud. Por favor verifica tu conexión.",
                timestamp: new Date(),
                type: 'text'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-white/50 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-brand-violet to-brand-midnight rounded-lg text-white shadow-md">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 tracking-tight">Gia</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-slate-500 font-medium">Conectado a AIG_PROD_DB</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="hidden sm:flex" disabled>
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Chat
                    </Button>
                </div>
            </div>

            {/* Messages Area - Premium Polish */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div className="max-w-3xl mx-auto w-full space-y-6"> {/* Centered & Wider */}
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className={cn(
                                    "flex gap-4",
                                    msg.role === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                {/* Avatar (Assistant) */}
                                {msg.role !== 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-violet to-brand-midnight flex items-center justify-center shrink-0 shadow-md ring-2 ring-white">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                {/* Content Bubble */}
                                <div className={cn(
                                    "rounded-2xl px-6 py-4 shadow-sm text-[15px] max-w-[85%] leading-relaxed tracking-wide",
                                    msg.role === 'user'
                                        ? "bg-brand-violet text-white rounded-br-none shadow-brand-violet/25"
                                        : "bg-white border border-slate-100 rounded-bl-none text-slate-700 shadow-slate-200/50"
                                )}>
                                    {msg.type === 'text' && (
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    )}

                                    {msg.type === 'code' && (
                                        <div className="font-mono text-xs bg-slate-900 text-slate-100 p-4 rounded-xl my-3 overflow-x-auto border border-slate-800 shadow-inner">
                                            {msg.content}
                                        </div>
                                    )}

                                    {msg.type === 'visualization' && msg.metadata && (
                                        <div className="w-full mt-3 space-y-4">
                                            <p className="font-medium text-slate-800">{msg.content}</p>
                                            <div className="bg-white/50 rounded-xl border border-slate-100 p-1">
                                                {msg.metadata.plotType === 'table' ? (
                                                    <DataTable data={msg.metadata.data} title={msg.metadata.title} className="border-0 shadow-none" />
                                                ) : (
                                                    <ChartRenderer
                                                        data={msg.metadata.data}
                                                        type={msg.metadata.plotType}
                                                        title={msg.metadata.title}
                                                        xKey={msg.metadata.xKey}
                                                        dataKey={msg.metadata.dataKey}
                                                        className="border-0 shadow-none h-[300px]"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" className="text-xs h-8 text-slate-500 hover:text-brand-violet hover:bg-brand-violet/5">
                                                    <Download className="w-3 h-3 mr-1" /> PDF
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-xs h-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50">
                                                    <FileText className="w-3 h-3 mr-1" /> CSV
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Avatar (User) */}
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white">
                                        <User className="w-5 h-5 text-slate-500" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        {isTyping && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-violet to-brand-midnight flex items-center justify-center shadow-md ring-2 ring-white">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-5 py-3 shadow-sm flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-bounce"></span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium ml-2">Pensando...</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Area - Floaty Glass */}
            <div className="p-6 bg-transparent">
                <div className="max-w-3xl mx-auto">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-violet to-brand-gold rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                        <div className="relative flex items-center bg-white rounded-xl shadow-xl shadow-slate-200/50">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Pregunta a Gia sobre tus datos..."
                                className="w-full pl-6 pr-14 py-4 bg-transparent border-0 rounded-xl focus:ring-0 text-[15px] text-slate-800 placeholder-slate-400"
                            />
                            <div className="absolute right-2 top-2">
                                <Button
                                    onClick={handleSend}
                                    className={cn(
                                        "h-10 w-10 p-0 rounded-lg transition-all duration-300",
                                        input.trim()
                                            ? "bg-brand-violet hover:bg-brand-violet-hover text-white shadow-lg shadow-brand-violet/30 hover:scale-105"
                                            : "bg-slate-100 text-slate-300 shadow-none"
                                    )}
                                    disabled={!input.trim() || isTyping}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                            Gia puede cometer errores. Verifica la información importante.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
