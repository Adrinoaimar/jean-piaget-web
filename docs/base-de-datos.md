# Consultas de Jean Piaget Sullana

Proyecto elegido por el usuario: `Adrinoaimar's Project`, ref `ignwxkpzpilecbkdzfpt`.

## Consultar y atender solicitudes

Entrar a https://supabase.com/dashboard/project/ignwxkpzpilecbkdzfpt/editor con una cuenta autorizada para ese proyecto. Abrir la tabla `public.jean_piaget_consultas`. Ordenar por `created_at` descendente y filtrar `tipo` por `admision` o `contacto`. El estado inicial es `pendiente`; se puede cambiar a `en_contacto` o `atendida` desde Table Editor.

No hay envío automático de correo ni de WhatsApp. Las solicitudes quedan en la tabla para su atención desde el panel de Supabase. Los enlaces directos de WhatsApp siguen disponibles.

## Arquitectura y permisos

GitHub Pages carga `js/form-config.js` (token público anon para el gateway con JWT requerido). El formulario envía JSON a `jean-piaget-intake`; el servicio valida campos, consentimiento y origen, y llama a `jean_piaget_submit` con credenciales disponibles solo en el entorno del servidor. No hay claves secretas en los archivos públicos.

La tabla tiene RLS habilitado y permisos revocados para `anon` y `authenticated`; deliberadamente no tiene políticas públicas. El RPC es SECURITY INVOKER y ejecutable solo por `service_role`. El acceso administrativo es mediante las cuentas autorizadas del proyecto Supabase, que aloja también otras aplicaciones.

El RPC limita atómicamente a cinco consultas por hora por identificador de conexión usando un bloqueo transaccional. Se conserva un hash derivado de la IP con sal del servidor, no la IP en claro. UUID de solicitud evita duplicados en reintentos. El control de origen no sustituye autenticación; el endpoint es para formularios públicos, con validación, honeypot y límite de envío. Ante abuso distribuido, agregar verificación antibot.

## Despliegue y mantenimiento

Las migraciones en `supabase/migrations` corresponden a las aplicadas en el proyecto. Código del servicio: `supabase/functions/jean-piaget-intake/index.ts`. Requiere `verify_jwt=true`, `SUPABASE_URL` y claves de servidor administradas por Supabase. El token público legacy se usa porque el gateway JWT requiere ese formato; planificar su migración antes de desactivar las claves legacy del proyecto.

Definir con el colegio su política de conservación y responsables de atención. La página de privacidad describe el registro actual y el proveedor, sin inventar plazos.

## Verificación realizada

- Envíos reales sintéticos por Contacto y Admisión desde navegador, confirmados en la base de datos.
- Reintentos con el mismo UUID sin duplicados; rechazo de campos inválidos, falta de consentimiento, honeypot y origen ajeno.
- Sexto envío por hora devuelve 429; lectura pública de la tabla y ejecución pública del RPC denegadas.
- Fallo de red conserva campos y restaura el botón. Vista móvil sin desbordamiento.
- Registros sintéticos eliminados tras las comprobaciones. Los avisos INFO de RLS sin políticas son esperados por el diseño privado de esta tabla.

Nota de revisión del proyecto compartido: `concurso_sheet_sync_state` tiene RLS desactivado, pero la comprobación directa confirmó `anon_select=false` y `anon_insert=false`. No se alteró esa tabla. Referencia: https://supabase.com/docs/guides/database/postgres/row-level-security
