"use client";

import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Minimize2, Database, Zap, Paperclip, Mic, ArrowUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { chatWithGia } from '@/lib/actions/gia-chat';

// Web Speech API type declarations (not available in all browsers)
interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionResultItem;
  [index: number]: SpeechRecognitionResultItem;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEventCustom extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventCustom extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionCustom extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventCustom) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventCustom) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionCustom;
    webkitSpeechRecognition: new () => SpeechRecognitionCustom;
  }
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date | null;
  metadata?: {
    database?: string;
    rowsAffected?: number;
    executionTime?: string;
  };
}

const exampleQuestions = [
  "Estado del stock en Almacén Central",
  "Facturación del Trimestre 1",
  "Listado de vencimientos pendientes",
  "Informe de rentabilidad por familia",
];

export function GiaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Analista Gia lista. ¿Qué información necesitas analizar hoy?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !selectedFile) || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSelectedFile(null);
    setIsTyping(true);

    try {
      // Call Edge Function via server action
      const result = await chatWithGia(
        [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        'No database connected yet.'
      );

      if (result.success && result.response) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Lo siento, hubo un error: ${result.error || 'Error desconocido'}`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Lo siento, hubo un error al procesar tu solicitud. Por favor verifica tu conexión.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExampleClick = (question: string) => {
    setInputValue(question);
  };

  /* Voice Dictation Logic */
  const [isListening, setIsListening] = useState(false);
  // SpeechRecognition type is not available in all browsers, use custom type
  const recognitionRef = useRef<SpeechRecognitionCustom | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Keep listening
        recognition.interimResults = true; // Show results in real-time
        recognition.lang = 'es-ES'; // Set Spanish language

        recognition.onresult = (event: SpeechRecognitionEventCustom) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }


          // Helper to capitalize and add smart punctuation
          const formatText = (text: string) => {
            if (!text) return '';

            // 1. Capitalize first letter strictly
            let formatted = text.charAt(0).toUpperCase() + text.slice(1);

            // 2. Aggressive Question Detection
            const lower = formatted.toLowerCase();
            const questionIndicators = [
              'qué', 'que ', 'cómo', 'como ', 'cuándo', 'cuando ',
              'dónde', 'donde ', 'por qué', 'por que ', 'quién', 'quien ',
              'cuál', 'cual ', 'cuánto', 'cuanto ', 'hola cómo', 'hola qu'
            ];

            const isQuestion = questionIndicators.some(indicator => lower.startsWith(indicator));

            if (isQuestion) {
              // Ensure opening mark
              if (!formatted.startsWith('¿')) {
                formatted = '¿' + formatted;
              }
              // Ensure closing mark
              if (!formatted.endsWith('?')) {
                formatted = formatted + '?';
              }
            }

            return formatted;
          };

          setInputValue((prev) => {
            const textToDisplay = finalTranscript || interimTranscript;
            return formatText(textToDisplay);
          });
        };

        recognition.onerror = (event: SpeechRecognitionErrorEventCustom) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          // If user stopped it manually, isListening is false.
          // If it stopped automatically (silence), we might want to update state
          if (isListening) setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    }
  }, []);

  const toggleDictation = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Clear input or append? User request: "ir escribiendo". 
      // Usually users expect to start speaking from where they are. 
      // BUT for simplicity in this artifact, let's start fresh or append logic in 'onresult' needs 'currentValue' context.
      // Let's keep it simple: Start recognition.
      recognitionRef.current.start();
      setIsListening(true);
    }
  };


  return (
    <>
      {/* Floating Action Button - The "Trigger" */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-900 shadow-[0_8px_30px_rgb(124,58,237,0.3)] hover:shadow-[0_8px_40px_rgb(124,58,237,0.5)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center border border-white/10"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/10 border border-white/10 group-hover:scale-110 transition-all duration-300">
              <span className="text-white font-black text-2xl font-satoshi translate-y-[-1px]">G</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white shadow-sm" />
          </div>
        </button>
      </div>

      {/* Chat Window - The "Stage" */}
      <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col transition-all duration-500 ease-spring ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <Card className="w-[calc(100vw-2rem)] sm:w-[22rem] h-[600px] max-h-[85vh] shadow-[0_20px_50px_rgb(0,0,0,0.15)] border-0 ring-1 ring-slate-200/60 bg-white/95 backdrop-blur-xl flex flex-col rounded-3xl overflow-hidden">

          {/* Header - Glassmorphism & Gradient */}
          <div className="relative bg-white/50 backdrop-blur-md px-5 pt-6 pb-4 flex items-center justify-between border-b border-slate-100/50 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/10 border border-white/10">
                  <span className="text-white font-black text-xl font-satoshi translate-y-[-1px]">G</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-white ring-1 ring-slate-100/50 shadow-sm" />
              </div>
              <div className="flex flex-col justify-center gap-0.5">
                <h3 className="font-bold text-slate-800 text-[15px] font-satoshi leading-none tracking-tight">
                  Gia AI
                </h3>
                <p className="text-[11px] text-slate-500 font-medium tracking-wide leading-none opacity-80">
                  Analista Senior
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50/50 transition-all duration-300"
            >
              <X className="w-4.5 h-4.5" />
            </Button>
          </div>

          {/* Messages Area - The "Content" */}
          <ScrollArea className="flex-1 bg-slate-50/50 relative overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="px-5 py-4 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[1.25rem] px-4 py-2.5 shadow-sm text-sm leading-relaxed ${message.role === 'user'
                      ? 'bg-violet-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                      }`}
                  >
                    <p className="text-[13px] leading-relaxed font-inter font-medium tracking-wide">{message.content}</p>

                    {message.metadata && (
                      <div className="mt-3 pt-3 border-t border-dashed border-slate-200/50 flex flex-wrap gap-2">
                        {message.metadata.database && (
                          <Badge variant="secondary" className="text-[10px] font-medium bg-slate-100 text-slate-600 gap-1 hover:bg-slate-200 transition-colors">
                            <Database className="w-3 h-3" />
                            {message.metadata.database}
                          </Badge>
                        )}
                        {message.metadata.rowsAffected && (
                          <Badge variant="secondary" className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {message.metadata.rowsAffected} resultados
                          </Badge>
                        )}
                        {message.metadata.executionTime && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 ml-auto font-mono">
                            <Zap className="w-3 h-3 text-amber-500" /> {message.metadata.executionTime}
                          </span>
                        )}
                      </div>
                    )}

                    {message.timestamp && (
                      <span
                        className={`text-[10px] mt-1 block font-medium text-right ${message.role === 'user' ? 'text-violet-100/90' : 'text-slate-400'}`}
                        suppressHydrationWarning
                      >
                        {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start w-full">
                  <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>



          {/* Input Area - "Command Center" */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0 z-20">
            {selectedFile && (
              <div className="mb-3 flex items-center gap-2 bg-violet-50 px-3 py-2 rounded-xl w-fit border border-violet-100 animate-in slide-in-from-bottom-2 fade-in duration-300">
                <div className="bg-white p-1.5 rounded-lg shadow-sm">
                  <Paperclip className="w-3.5 h-3.5 text-violet-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-violet-900 max-w-[150px] truncate">{selectedFile.name}</span>
                  <span className="text-[9px] text-violet-400">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="ml-2 hover:bg-violet-200/50 p-1 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-violet-400" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2 bg-slate-50/80 border border-slate-200 rounded-[1.25rem] p-1.5 pr-2 focus-within:ring-2 focus-within:ring-violet-500/10 focus-within:border-violet-500/30 focus-within:bg-white transition-all duration-300 shadow-sm hover:shadow-md">

              <div className="flex gap-0.5">
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="h-9 w-9 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors shrink-0"
                >
                  <Paperclip className="w-4.5 h-4.5" />
                </Button>
                <Button
                  onClick={toggleDictation}
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 rounded-xl transition-all duration-300 ${isListening ? 'bg-violet-100 text-violet-600 scale-110 shadow-sm' : 'text-slate-400 hover:text-violet-600 hover:bg-violet-50'}`}
                >
                  <div className="relative">
                    <Mic className={`w-4.5 h-4.5 ${isListening ? 'animate-pulse' : ''}`} />
                    {isListening && <span className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full animate-ping" />}
                  </div>
                </Button>
              </div>

              <Input
                type="text"
                placeholder={isListening ? "Escuchando..." : "Pregunta a Gia..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2.5 h-auto text-[13px] font-medium placeholder:text-slate-400 min-w-0"
              />

              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="h-9 w-9 bg-gradient-to-br from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-xl shadow-[0_4px_14px_0_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] shrink-0 disabled:opacity-50 disabled:shadow-none transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </div>

          </div>
        </Card>
      </div>
    </>
  );
}
