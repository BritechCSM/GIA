'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Schemas
const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

const RegisterSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    organizationName: z.string().min(2, 'El nombre de empresa debe tener al menos 2 caracteres'),
})

// Result type
type ActionResult =
    | { success: true; message?: string }
    | { success: false; error: string }

/**
 * Login with email and password
 */
export async function login(formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const parsed = LoginSchema.safeParse({ email, password })
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
    })

    if (error) {
        console.error('Login error:', error.message)
        return { success: false, error: 'Credenciales incorrectas' }
    }

    return { success: true }
}

/**
 * Register new user with organization
 */
export async function register(formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const organizationName = formData.get('organizationName') as string

    const parsed = RegisterSchema.safeParse({ email, password, fullName, organizationName })
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message }
    }

    const supabase = await createClient()

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
            data: {
                full_name: parsed.data.fullName,
            },
        },
    })

    if (authError || !authData.user) {
        console.error('Auth error:', authError?.message)
        return { success: false, error: authError?.message || 'Error al crear cuenta' }
    }

    // 2. Create organization
    const slug = parsed.data.organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
            name: parsed.data.organizationName,
            slug: `${slug}-${Date.now()}`,
        })
        .select('id')
        .single()

    if (orgError) {
        console.error('Org creation error:', orgError.message)
        // Note: User is created but org failed. We'll handle this gracefully.
        return { success: true, message: 'Cuenta creada. Configura tu organización después de iniciar sesión.' }
    }

    // 3. Create membership (owner)
    const { error: membershipError } = await supabase
        .from('memberships')
        .insert({
            user_id: authData.user.id,
            organization_id: org.id,
            role: 'owner',
        })

    if (membershipError) {
        console.error('Membership error:', membershipError.message)
    }

    redirect('/')
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

/**
 * Get current user with profile and organization
 */
export async function getCurrentUser() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    // Get profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Get membership with organization
    const { data: membership } = await supabase
        .from('memberships')
        .select(`
      *,
      organization:organizations(*)
    `)
        .eq('user_id', user.id)
        .single()

    return {
        user,
        profile,
        membership,
        organization: membership?.organization,
    }
}
