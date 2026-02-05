"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { Button } from './ui/button';
import { ChatInterface } from './chat-interface';
import { cn } from '@/lib/utils'; // Fixed import path

export function GiaFloatingChat() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-[450px] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
                    >
                        {/* Custom Header for Floating Mode */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white/50 backdrop-blur-sm absolute top-0 left-0 right-0 z-10">
                            <span className="font-semibold text-slate-700 text-sm">Gia Assistant</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4 text-slate-400" />
                            </Button>
                        </div>

                        {/* Chat Interface - Adjusted padding/header via CSS/Props if needed */}
                        <div className="flex-1 pt-10 h-full">
                            {/* We might need to adjust ChatInterface to hide its own header if floating, 
                                but for now let's just render it. Ideally ChatInterface accepts 'isFloating' prop. 
                                fixing styling in next step if needed. */}
                            <ChatInterface />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors duration-300",
                    isOpen
                        ? "bg-slate-800 text-white rotate-90"
                        : "bg-gradient-to-r from-brand-violet to-brand-midnight text-white"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>
        </div>
    );
}
