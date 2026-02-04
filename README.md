# 🎯 GIA - Gestión Inteligente con IA

Dashboard B2B que permite a empresas gestionar y analizar datos con IA para mayor productividad.

## 🚀 Quick Start

```bash
# Instalar dependencias
cd web
npm install --legacy-peer-deps

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📋 Características

### Autenticación
- ✅ Login con email/password
- ✅ Registro con creación automática de organización
- ✅ Protección de rutas con middleware
- ✅ Sesiones seguras con Supabase Auth

### Fuentes de Datos
- ✅ Conexión a PostgreSQL, MySQL, SQL Server, Oracle
- ✅ Gestión de credenciales
- ✅ Estado de conexión en tiempo real
- ✅ Pruebas de conexión

### Dashboard
- ✅ Diseño responsive
- ✅ Chat con IA (GiaAssistant)
- ✅ Visualizaciones de datos
- ✅ Sidebar navegable

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Supabase (Auth, Database, RLS) |
| AI | Vercel AI SDK + OpenAI |
| UI | Radix UI, Lucide Icons |
| Gráficos | Recharts |

## 📁 Estructura del Proyecto

```
GIA/
├── web/                    # Aplicación Next.js
│   ├── app/               # App Router pages
│   │   ├── login/         # Autenticación
│   │   ├── register/
│   │   └── data-sources/  # Gestión de DBs
│   ├── components/        # React components
│   ├── lib/              
│   │   ├── actions/       # Server actions
│   │   ├── supabase/      # Supabase clients
│   │   └── design-tokens.ts
│   └── middleware.ts      # Auth middleware
├── .github/workflows/     # CI/CD
└── README.md
```

## 🔐 Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
```

## 🗄️ Base de Datos

### Tablas
- `organizations` - Empresas cliente (multi-tenant)
- `profiles` - Perfiles de usuario
- `memberships` - Roles de usuario en organizaciones
- `data_sources` - Conexiones a DBs externas
- `ai_conversations` - Historial de chat con IA
- `dashboards` - Configuraciones de dashboard

### Seguridad
- Row Level Security (RLS) en todas las tablas
- Políticas basadas en organización
- Funciones con search_path seguro

## 🚢 Deploy

### Vercel (Recomendado)

**Dominio de producción:** `gia-analista.vercel.app`

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push a `main`
4. **Nota:** Si aparecen múltiples dominios, elimina los no deseados desde Settings → Domains en Vercel

### Secrets necesarios en GitHub

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 📄 Licencia

Propiedad de Informática ROS © 2026
