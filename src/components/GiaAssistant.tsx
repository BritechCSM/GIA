import { useState } from 'react';
import { Sparkles, X, Send, Minimize2, Database, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    database?: string;
    rowsAffected?: number;
    executionTime?: string;
  };
}

const exampleQuestions = [
  "Dame las ventas de ayer",
  "Muéstrame los clientes top del mes",
  "¿Qué productos tienen stock bajo?",
  "Lista las facturas pendientes",
];

export function GiaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "¡Hola! Soy Gia, tu asistente de inteligencia de datos. Puedo ayudarte a consultar y analizar información de tus bases de datos. ¿Qué necesitas saber?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response with database info
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `He ejecutado tu consulta "${userMessage.content}". Los resultados se han generado en la Consola de Análisis. Encontré información relevante que puedes revisar ahora.`,
        timestamp: new Date(),
        metadata: {
          database: 'Production DB',
          rowsAffected: 8,
          executionTime: '0.24s',
        },
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
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

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-violet-900 via-violet-800 to-violet-700 shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 hover:scale-110 flex items-center justify-center z-50 group"
        >
          <Sparkles className="w-7 h-7 text-white animate-pulse" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[28rem] h-[36rem] shadow-2xl border-slate-200 flex flex-col z-50 rounded-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-violet-900 via-violet-800 to-violet-700 backdrop-blur-lg p-5 flex items-center justify-between border-b border-violet-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center relative">
                <Sparkles className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-violet-900" />
              </div>
              <div>
                <h3 className="font-black text-white text-lg" style={{ fontFamily: 'Satoshi' }}>
                  Gia
                </h3>
                <p className="text-xs text-violet-200">Asistente IA • En línea</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 p-0 text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 p-0 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-5 bg-slate-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-violet-900 to-violet-800 text-white'
                        : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {message.metadata && (
                      <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap gap-2">
                        {message.metadata.database && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Database className="w-3 h-3" />
                            {message.metadata.database}
                          </Badge>
                        )}
                        {message.metadata.rowsAffected && (
                          <Badge variant="secondary" className="text-xs">
                            {message.metadata.rowsAffected} resultados
                          </Badge>
                        )}
                        {message.metadata.executionTime && (
                          <Badge variant="secondary" className="text-xs">
                            {message.metadata.executionTime}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <span className={`text-xs mt-1.5 block ${
                      message.role === 'user' ? 'text-violet-200' : 'text-slate-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-900 border border-slate-200 shadow-sm rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Example Questions */}
          {messages.length === 1 && (
            <div className="px-5 py-3 bg-white border-t border-slate-200">
              <p className="text-xs font-medium text-slate-500 mb-2">Prueba preguntar:</p>
              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(question)}
                    className="text-xs px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full hover:bg-violet-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Escribe tu consulta..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-slate-50 border-slate-200 focus:border-violet-300 focus:ring-violet-300"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 p-0 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Presiona Enter para enviar • Gia analiza tus datos en tiempo real
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
