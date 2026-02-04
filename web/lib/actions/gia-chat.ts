"use server";

import { createClient } from '@/lib/supabase/server';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export async function chatWithGia(messages: Message[], schemaContext?: string) {
    try {
        const supabase = await createClient();

        // Get current session for auth
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return { success: false, error: 'No autorizado' };
        }

        // Call Edge Function
        const { data, error } = await supabase.functions.invoke('gia-chat', {
            body: { messages, schemaContext },
        });

        if (error) {
            console.error('Edge function error:', error);
            return { success: false, error: error.message || 'Error al procesar la solicitud' };
        }

        if (data.error) {
            return { success: false, error: data.error };
        }

        return { success: true, response: data.response };
    } catch (e) {
        console.error('Chat error:', e);
        return { success: false, error: 'Error inesperado. Inténtalo de nuevo.' };
    }
}
