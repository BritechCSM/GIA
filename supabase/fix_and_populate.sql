-- =========================================================================================
-- SCRIPT MAESTRO: DIAGNÓSTICO, CORRECCIÓN Y POBLACIÓN DE DATOS (GIA)
-- =========================================================================================

-- BLOQUE 1: DIAGNÓSTICO Y PREPARACIÓN
DO $$
DECLARE
    v_org_id uuid;
    v_user_id uuid;
BEGIN
    RAISE NOTICE '>>> INICIANDO SCRIPT MAESTRO...';

    -- 1. OBTENER IDs NECESARIOS
    SELECT id INTO v_org_id FROM public.organizations LIMIT 1;
    IF v_org_id IS NULL THEN
        RAISE EXCEPTION '❌ CRÍTICO: No se encontró ninguna organización en la tabla `organizations`.';
    END IF;
    RAISE NOTICE '✅ Organización encontrada: %', v_org_id;

    SELECT id INTO v_user_id FROM auth.users WHERE email = 'bniwoyda@gmail.com' LIMIT 1;
    IF v_user_id IS NULL THEN
        SELECT id INTO v_user_id FROM auth.users LIMIT 1;
    END IF;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION '❌ CRÍTICO: No se encontró ningún usuario en la tabla `auth.users`.';
    END IF;
    RAISE NOTICE '✅ Usuario encontrado: %', v_user_id;

    -- 2. DESHABILITAR TEMPORALMENTE RLS (Para garantizar inserts)
    RAISE NOTICE '>>> Deshabilitando RLS temporalmente...';
    EXECUTE 'ALTER TABLE public.data_sources DISABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.ai_conversations DISABLE ROW LEVEL SECURITY';
    
    -- 3. CORREGIR CONSTRAINTS (Para permitir Snowflake)
    RAISE NOTICE '>>> Verificando support para Snowflake...';
    EXECUTE 'ALTER TABLE public.data_sources DROP CONSTRAINT IF EXISTS data_sources_type_check';
    EXECUTE 'ALTER TABLE public.data_sources ADD CONSTRAINT data_sources_type_check CHECK (type IN (''postgresql'', ''mysql'', ''sqlserver'', ''oracle'', ''api'', ''csv'', ''snowflake''))';
    RAISE NOTICE '✅ Constraint actualizado para soportar Snowflake';
END $$;


-- BLOQUE 2: POBLACIÓN DE DATOS
DO $$
DECLARE
    v_org_id uuid;
    v_user_id uuid;
    v_ds_sales_id uuid;
    v_ds_marketing_id uuid;
BEGIN
    -- Recargar IDs (scope nuevo)
    SELECT id INTO v_org_id FROM public.organizations LIMIT 1;
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'bniwoyda@gmail.com' LIMIT 1;
    IF v_user_id IS NULL THEN SELECT id INTO v_user_id FROM auth.users LIMIT 1; END IF;

    RAISE NOTICE '>>> Poblando `data_sources`...';

    -- Insert Sales Database (PostgreSQL)
    SELECT id INTO v_ds_sales_id FROM public.data_sources WHERE name = 'Sales Database' AND organization_id = v_org_id;
    IF v_ds_sales_id IS NULL THEN
        INSERT INTO public.data_sources (organization_id, name, type, connection_config, created_by, description, status)
        VALUES (v_org_id, 'Sales Database', 'postgresql', '{"host": "demo.postgresql.com", "port": 5432, "database": "sales", "username": "demo_user", "password": "demo_password_123"}'::jsonb, v_user_id, 'Base de datos de ventas principal', 'connected')
        RETURNING id INTO v_ds_sales_id;
        RAISE NOTICE '✅ Insertado: Sales Database ID: %', v_ds_sales_id;
    ELSE
        RAISE NOTICE 'ℹ️ Ya existe: Sales Database ID: %', v_ds_sales_id;
    END IF;

    -- Insert Marketing Analytics (Snowflake)
    SELECT id INTO v_ds_marketing_id FROM public.data_sources WHERE name = 'Marketing Analytics' AND organization_id = v_org_id;
    IF v_ds_marketing_id IS NULL THEN
        INSERT INTO public.data_sources (organization_id, name, type, connection_config, created_by, description, status)
        VALUES (v_org_id, 'Marketing Analytics', 'snowflake', '{"account": "demo.snowflake.com", "warehouse": "ANALYTICS", "database": "MARKETING", "username": "demo_user", "password": "demo_password_123"}'::jsonb, v_user_id, 'Data warehouse de marketing', 'connected')
        RETURNING id INTO v_ds_marketing_id;
        RAISE NOTICE '✅ Insertado: Marketing Analytics ID: %', v_ds_marketing_id;
    ELSE
        RAISE NOTICE 'ℹ️ Ya existe: Marketing Analytics ID: %', v_ds_marketing_id;
        -- Actualizar para asegurarse que es snowflake si ya existia pero con otro tipo (raro pero posible)
        UPDATE public.data_sources SET type = 'snowflake' WHERE id = v_ds_marketing_id AND type != 'snowflake';
    END IF;


    RAISE NOTICE '>>> Poblando `ai_conversations`...';
    
    -- Insert Conversation
    IF NOT EXISTS (SELECT 1 FROM public.ai_conversations WHERE title = 'Análisis de Ventas Q3' AND organization_id = v_org_id) THEN
        INSERT INTO public.ai_conversations (
            organization_id, user_id, data_source_id, title, messages, is_archived
        ) VALUES (
            v_org_id,
            v_user_id,
            v_ds_sales_id, 
            'Análisis de Ventas Q3',
            '[
                {
                  "role": "user",
                  "content": "Muéstrame las ventas del Q3"
                },
                {
                  "role": "assistant",
                  "content": "Aquí tienes un resumen de las ventas del Q3:\n\n📊 **Resumen Ejecutivo:**\n- Total de ventas: $2.4M\n- Crecimiento: +15% vs Q2\n- Top producto: Widget Pro ($450K)\n- Clientes nuevos: 127\n\n📈 **Tendencias:**\n- Las ventas aumentaron consistentemente mes a mes\n- El producto Widget Pro representó el 18.75% del total\n- El segmento B2B creció un 22% vs Q2\n\n¿Quieres profundizar en algún aspecto específico? Puedo generar gráficos o análisis más detallados."
                }
            ]'::jsonb,
            false
        );
        RAISE NOTICE '✅ Insertado: Conversación "Análisis de Ventas Q3"';
    ELSE
        RAISE NOTICE 'ℹ️ Ya existe: Conversación "Análisis de Ventas Q3"';
    END IF;

    -- 5. REHABILITAR RLS
    RAISE NOTICE '>>> Rehabilitando RLS...';
    EXECUTE 'ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY';

END $$;


-- BLOQUE 3: VERIFICACIÓN FINAL
DO $$
DECLARE
    v_count_ds integer;
    v_count_ai integer;
BEGIN
    SELECT count(*) INTO v_count_ds FROM public.data_sources;
    SELECT count(*) INTO v_count_ai FROM public.ai_conversations;
    
    RAISE NOTICE '=============================================';
    RAISE NOTICE '>>> REPORTE FINAL';
    RAISE NOTICE '    Data Sources: % (Esperado: >=2)', v_count_ds;
    RAISE NOTICE '    AI Conversations: % (Esperado: >=1)', v_count_ai;
    RAISE NOTICE '=============================================';
END $$;
