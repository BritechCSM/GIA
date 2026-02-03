# 🎮 Manual de Mando - Antigravity Skills System

## Visión General

Este sistema de Skills sigue el **Software Development Lifecycle (SDLC)** profesional. Cada skill representa un rol experto que se activa en la fase correspondiente del proceso de desarrollo.

```
DISCOVERY → DESIGN → BUILD → QUALITY → DEPLOY → DOCUMENT → COMMUNICATE
```

---

## 📋 Referencia Rápida por Fase

### FASE 1: DISCOVERY (Descubrimiento)

#### 01 - Product Strategy
**Rol:** Senior Product Manager  
**Cuándo:** Ideas vagas, priorización, definición de features

```
Comandos:
→ "Genera ideas para mejorar [retención/onboarding] y priorízalas con RICE"
→ "Escribe User Stories para [feature X]"
→ "¿Qué problema resolvemos con [idea]?"
→ "Analiza la competencia para [producto]"
```

#### 02 - Brand Identity
**Rol:** Brand Voice Lead  
**Cuándo:** Textos de UI, copy de marketing, tono de comunicación

```
Comandos:
→ "Redacta el copy para la landing con voz [cercana/profesional]"
→ "Reescribe estos textos de error más humanos"
→ "Define la guía de voz para [marca]"
→ "Revisa si este texto suena a nuestra marca"
```

---

### FASE 2: DESIGN (Diseño)

#### 03 - Solutions Architect
**Rol:** Staff Solutions Architect  
**Cuándo:** Antes de codificar features complejas

```
Comandos:
→ "Diseña la arquitectura técnica para [sistema de usuarios/pagos]"
→ "Crea el esquema de base de datos con RLS para [módulo]"
→ "Documenta el API contract para [endpoint]"
→ "Haz el Architecture Decision Record para [decisión]"
```

#### 04 - Design Systems
**Rol:** Creative Director & Design Systems Lead  
**Cuándo:** Crear componentes UI, estilos premium, accesibilidad

```
Comandos:
→ "Diseña un componente [Card/Modal/Button] premium"
→ "Aplica glassmorphism a [componente]"
→ "Audita la accesibilidad de [pantalla]"
→ "Arregla el diseño de [componente], se ve mal en móvil"
```

---

### FASE 3: BUILD (Construcción)

#### 05 - Frontend Engineer
**Rol:** Senior Frontend Engineer  
**Cuándo:** Implementar UI en React/TypeScript

```
Comandos:
→ "Implementa el componente [X] con React Query"
→ "Crea el hook para [funcionalidad]"
→ "Arregla el estado de carga/error en [componente]"
→ "Añade validación con Zod al formulario de [X]"
```

#### 06 - Backend Engineer
**Rol:** Senior Backend Engineer  
**Cuándo:** APIs, Server Actions, queries de base de datos

```
Comandos:
→ "Crea el Server Action para [crear/editar X]"
→ "Implementa el endpoint API para [recurso]"
→ "Optimiza la query de [listado]"
→ "Añade autenticación al middleware"
```

---

### FASE 4: QUALITY (Calidad)

#### 07 - Quality Assurance
**Rol:** QA Lead & Release Engineer  
**Cuándo:** Antes de deploy, bugs en producción

```
Comandos:
→ "Haz auditoría de calidad de [archivo/feature]"
→ "Revisa este código para producción"
→ "Genera reporte QA para [versión]"
→ "Encuentra por qué [bug] está pasando"
```

---

### FASE 5: DEPLOY (Despliegue)

#### 08 - Platform Engineering
**Rol:** Staff SRE & Platform Engineer  
**Cuándo:** CI/CD, infraestructura, configuración de producción

```
Comandos:
→ "Configura GitHub Actions para deploy automático"
→ "Audita la seguridad de mi configuración Supabase"
→ "Crea el workflow de CI/CD completo"
→ "Configura los headers de seguridad en Vercel"
```

---

### FASE 6: DOCUMENT (Documentación)

#### 09 - Technical Writer
**Rol:** Senior Technical Writer  
**Cuándo:** READMEs, documentación API, guías

```
Comandos:
→ "Escribe el README para [proyecto]"
→ "Documenta el API de [endpoints]"
→ "Crea guía de cómo hacer [tarea]"
→ "Genera changelog para [versión]"
```

---

### FASE 7: COMMUNICATE (Comunicación)

#### 10 - Strategy Consulting
**Rol:** MBB-Level Strategy Consultant  
**Cuándo:** Presentaciones, pitch decks, reportes ejecutivos

```
Comandos:
→ "Crea pitch deck para [inversores/clientes]"
→ "Escribe executive summary de [proyecto]"
→ "Prepara presentación de [resultados Q3]"
→ "Diseña roadmap visual para [stakeholders]"
```

---

## 💡 Tips Pro

### Combinar Roles

```
"Como Product Strategy define las features de un CRM,
 luego como Solutions Architect diseña la base de datos,
 y finalmente como Frontend Engineer implementa el MVP"
```

### Flujo Completo de Feature

```
1. Product Strategy    → Define User Stories y priorización
2. Brand Identity      → Define textos y tono de voz
3. Solutions Architect → Diseña schema, RLS, y API contracts
4. Design Systems      → Crea componentes UI premium
5. Frontend Engineer   → Implementa cliente React
6. Backend Engineer    → Implementa Server Actions y APIs
7. Quality Assurance   → Audita antes de deploy
8. Platform Engineering → Configura CI/CD y despliega
9. Technical Writer    → Documenta el feature
10. Strategy Consulting → Presenta resultados a stakeholders
```

### Quality Gates (Puertas de Calidad)

Antes de pasar a la siguiente fase:

| Transición | Requisito |
|------------|-----------|
| Discovery → Design | Problem Statement + User Stories definidas |
| Design → Build | Architecture Decision Record aprobado |
| Build → Quality | Feature completo, sin errores bloqueantes |
| Quality → Deploy | Tests pasando, auditoría de seguridad limpia |
| Deploy → Document | Deployment en producción verificado |

---

## 🎯 Comandos de Activación Rápida

| Necesidad | Comando |
|-----------|---------|
| Nueva feature | "Product Strategy: define [X]" |
| Textos de UI | "Brand Identity: escribe [X]" |
| Base de datos | "Solutions Architect: diseña schema para [X]" |
| Componente bonito | "Design Systems: crea [X] premium" |
| Código React | "Frontend Engineer: implementa [X]" |
| API/Backend | "Backend Engineer: crea endpoint para [X]" |
| Revisar código | "Quality Assurance: audita [X]" |
| Desplegar | "Platform Engineering: configura deploy para [X]" |
| Documentar | "Technical Writer: documenta [X]" |
| Presentar | "Strategy Consulting: prepara deck de [X]" |

---

## 📁 Estructura de Archivos

```
antigravity-skills/
├── SYSTEM_ARCHITECTURE.md          # Visión general del sistema
├── MANUAL_DE_MANDO.md              # Este archivo
│
├── 01-product-strategy/
│   ├── SKILL.md
│   └── references/frameworks.md
│
├── 02-brand-identity/
│   ├── SKILL.md
│   └── references/
│       ├── voice-guide.md
│       └── visual-tokens.json
│
├── 03-solutions-architect/
│   ├── SKILL.md
│   └── references/
│       ├── database-patterns.md
│       └── security-checklist.md
│
├── 04-design-systems/
│   ├── SKILL.md
│   └── references/
│       ├── component-patterns.md
│       └── accessibility.md
│
├── 05-frontend-engineer/
│   ├── SKILL.md
│   └── references/
│       ├── react-patterns.md
│       └── css-patterns.md
│
├── 06-backend-engineer/
│   ├── SKILL.md
│   └── references/api-patterns.md
│
├── 07-quality-assurance/
│   ├── SKILL.md
│   └── references/testing-checklist.md
│
├── 08-platform-engineering/
│   ├── SKILL.md
│   └── references/ci-cd-templates.md
│
├── 09-technical-writer/
│   ├── SKILL.md
│   └── references/documentation-standards.md
│
└── 10-strategy-consulting/
    ├── SKILL.md
    └── references/presentation-frameworks.md
```

---

## 🔄 Compatibilidad

Este sistema está diseñado para funcionar con:

- **Claude (Anthropic)** - Target principal
- **Gemini (Google)** - Compatible con guardrails

Los skills incluyen instrucciones claras que ambos modelos pueden seguir manteniendo las buenas prácticas de desarrollo.
