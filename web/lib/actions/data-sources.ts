'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Schemas
const DataSourceSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    description: z.string().optional(),
    type: z.enum(['postgresql', 'mysql', 'sqlserver', 'oracle', 'api', 'csv']),
    connectionConfig: z.object({
        host: z.string().min(1, 'Host es requerido'),
        port: z.coerce.number().min(1).max(65535),
        database: z.string().min(1, 'Base de datos es requerida'),
        username: z.string().min(1, 'Usuario es requerido'),
        password: z.string().min(1, 'Contraseña es requerida'),
        ssl: z.boolean().default(false),
    }),
})

type ActionResult<T = void> =
    | { success: true; data?: T; message?: string }
    | { success: false; error: string }

/**
 * Get all data sources for the current user's organization
 */
export async function getDataSources(): Promise<ActionResult<any[]>> {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, error: 'No autorizado' }
    }

    // Get user's organization
    const { data: membership } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

    if (!membership) {
        return { success: false, error: 'No perteneces a ninguna organización' }
    }

    // Get data sources
    const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .eq('organization_id', membership.organization_id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching data sources:', error)
        return { success: false, error: 'Error al obtener las fuentes de datos' }
    }

    return { success: true, data }
}

/**
 * Create a new data source
 */
export async function createDataSource(formData: FormData): Promise<ActionResult<{ id: string }>> {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, error: 'No autorizado' }
    }

    // Get user's organization
    const { data: membership } = await supabase
        .from('memberships')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .single()

    if (!membership) {
        return { success: false, error: 'No perteneces a ninguna organización' }
    }

    if (!['owner', 'admin'].includes(membership.role)) {
        return { success: false, error: 'No tienes permisos para crear fuentes de datos' }
    }

    // Parse form data
    const rawData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        type: formData.get('type') as string,
        connectionConfig: {
            host: formData.get('host') as string,
            port: formData.get('port') as string,
            database: formData.get('database') as string,
            username: formData.get('username') as string,
            password: formData.get('password') as string,
            ssl: formData.get('ssl') === 'true',
        },
    }

    const parsed = DataSourceSchema.safeParse(rawData)
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message }
    }

    // Insert data source
    const { data, error } = await supabase
        .from('data_sources')
        .insert({
            organization_id: membership.organization_id,
            created_by: user.id,
            name: parsed.data.name,
            description: parsed.data.description,
            type: parsed.data.type,
            connection_config: parsed.data.connectionConfig,
            status: 'pending',
        })
        .select('id')
        .single()

    if (error) {
        console.error('Error creating data source:', error)
        return { success: false, error: 'Error al crear la fuente de datos' }
    }

    revalidatePath('/data-sources')
    return { success: true, data: { id: data.id }, message: 'Fuente de datos creada correctamente' }
}

/**
 * Test connection to a data source
 */
export async function testDataSourceConnection(id: string): Promise<ActionResult> {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, error: 'No autorizado' }
    }

    // Get data source with connection config
    const { data: dataSource, error } = await supabase
        .from('data_sources')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !dataSource) {
        return { success: false, error: 'Fuente de datos no encontrada' }
    }

    // Actual connection test based on database type
    let isConnected = false
    let errorMessage: string | null = null

    try {
        const config = dataSource.connection_config as {
            host: string
            port: number
            database: string
            username: string
            password: string
            ssl?: boolean
        }

        if (dataSource.type === 'postgresql') {
            // Import pg dynamically to avoid client-side bundling
            const { Client } = await import('pg')

            const client = new Client({
                host: config.host,
                port: config.port,
                database: config.database,
                user: config.username,
                password: config.password,
                ssl: config.ssl ? { rejectUnauthorized: false } : false,
                connectionTimeoutMillis: 5000, // 5 second timeout
            })

            await client.connect()
            await client.query('SELECT 1')
            await client.end()
            isConnected = true
        } else if (dataSource.type === 'mysql' || dataSource.type === 'sqlserver') {
            // MySQL/SQL Server not yet implemented - return specific error
            return {
                success: false,
                error: `Prueba de conexión para ${dataSource.type} no implementada aún. Solo PostgreSQL está soportado.`
            }
        } else {
            return { success: false, error: `Tipo de base de datos no soportado: ${dataSource.type}` }
        }
    } catch (err) {
        isConnected = false
        errorMessage = err instanceof Error ? err.message : 'Error de conexión desconocido'
    }

    // Update status in database
    await supabase
        .from('data_sources')
        .update({
            status: isConnected ? 'connected' : 'error',
            last_sync_at: isConnected ? new Date().toISOString() : null,
            last_error: isConnected ? null : errorMessage,
        })
        .eq('id', id)

    revalidatePath('/data-sources')

    if (isConnected) {
        return { success: true, message: 'Conexión exitosa' }
    } else {
        return { success: false, error: errorMessage || 'Error de conexión' }
    }
}

/**
 * Delete a data source
 */
export async function deleteDataSource(id: string): Promise<ActionResult> {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, error: 'No autorizado' }
    }

    const { error } = await supabase
        .from('data_sources')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting data source:', error)
        return { success: false, error: 'Error al eliminar la fuente de datos' }
    }

    revalidatePath('/data-sources')
    return { success: true, message: 'Fuente de datos eliminada' }
}
