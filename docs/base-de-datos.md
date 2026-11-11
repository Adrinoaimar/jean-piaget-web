# Consultas de Jean Piaget Sullana

Proyecto elegido por el usuario: `Adrinoaimar's Project`, ref `ignwxkpzpilecbkdzfpt`.

## Consultar y atender solicitudes

Entrar a https://supabase.com/dashboard/project/ignwxkpzpilecbkdzfpt/editor con una cuenta autorizada para ese proyecto. Abrir la tabla `public.jean_piaget_consultas`. Ordenar por `created_at` descendente y filtrar `tipo` por `admision` o `contacto`. El estado inicial es `pendiente`; se puede cambiar a `en_contacto` o `atendida` desde Table Editor.

No hay envío automático de correo ni de WhatsApp. Las solicitudes quedan en la tabla para su atención desde el panel de Supabase. Los enlaces directos de WhatsApp siguen disponibles.

## Arquitectura y permisos

GitHub Pages carga `js/form-config.js` (token público anon para el gateway con JWT requerido). El formulario envía JSON a `jean-piaget-intake`; el servicio valida campos, consentimiento y origen, y llama a `jean_piaget_submit` con credenciales disponibles solo en el entorno del servidor. No hay claves secretas en los archivos públicos.

La tabla tiene RLS habilitado y acceso público anónimo revocado. Los usuarios de Supabase Auth incluidos en `jean_piaget_admins` pueden leer columnas de atención y actualizar exclusivamente estado y notas. Los demás usuarios autenticados no pueden leer ni actualizar filas. El RPC de recepción sigue siendo SECURITY INVOKER y ejecutable solo por `service_role`. El hash de conexión permanece fuera de las columnas accesibles para el panel.

El RPC limita atómicamente a cinco consultas por hora por identificador de conexión usando un bloqueo transaccional. Se conserva un hash derivado de la IP con sal del servidor, no la IP en claro. UUID de solicitud evita duplicados en reintentos. El control de origen no sustituye autenticación; el endpoint es para formularios públicos, con validación, honeypot y límite de envío. Ante abuso distribuido, agregar verificación antibot.

## Despliegue y mantenimiento

Las migraciones en `supabase/migrations` corresponden a las aplicadas en el proyecto. Código del servicio: `supabase/functions/jean-piaget-intake/index.ts`. Requiere `verify_jwt=true`, `SUPABASE_URL` y claves de servidor administradas por Supabase. El token público legacy se usa porque el gateway JWT requiere ese formato; planificar su migración antes de desactivar las claves legacy del proyecto.

Definir con el colegio su política de conservación y responsables de atención. La página de privacidad describe el registro actual y el proveedor, sin inventar plazos.

## Verificación realizada

- Envíos reales sintéticos por Contacto y Admisión desde navegador, confirmados en la base de datos.
- Reintentos con el mismo UUID sin duplicados; rechazo de campos inválidos, falta de consentimiento, honeypot y origen ajeno.
- Sexto envío por hora devuelve 429; lectura pública de la tabla y ejecución pública del RPC denegadas.
- Fallo de red conserva campos y restaura el botón. Vista móvil sin desbordamiento.
- Registros sintéticos eliminados tras las comprobaciones. La revisión de seguridad posterior al panel no encontró avisos nuevos para los objetos de Jean Piaget.

Nota de revisión del proyecto compartido: `concurso_sheet_sync_state` tiene RLS desactivado, pero la comprobación directa confirmó `anon_select=false` y `anon_insert=false`. No se alteró esa tabla. Referencia: https://supabase.com/docs/guides/database/postgres/row-level-security

## Panel web de administración

URL: https://adrinoaimar.github.io/jean-piaget-web/admin.html (también enlazado desde el pie del sitio). Acceso inicial autorizado: `adriano.aimar12@gmail.com`, con la contraseña de su cuenta existente de Supabase Auth en este proyecto. La cuenta ya estaba confirmada; no se cambió su contraseña.

El panel permite buscar nombre, correo o postulante; filtrar Contacto/Admisión y estado; paginar de 20 en 20; ver detalles; abrir correo o WhatsApp sin enviar automáticamente; guardar notas internas y estados; archivar/restaurar. Los contadores muestran todos los registros autorizados, independientemente del filtro.

La sesión se conserva únicamente en memoria de esta página. No se guardan contraseñas ni tokens en almacenamiento del navegador; recargar requiere autenticación de nuevo. Cerrar sesión revoca la sesión local mediante Supabase Auth y borra la bandeja de la interfaz. El token se renueva en memoria mientras la página está abierta.

Permisos: `jean_piaget_admins` contiene IDs de usuarios de Auth, con RLS de lectura de su propia membresía y sin permisos cliente de inserción, actualización o borrado. El alta inicial usa SELECT de la cuenta confirmada indicada por el usuario. Las políticas de solicitudes comprueban esa membresía en cada operación. Los usuarios de otras aplicaciones del proyecto no obtienen acceso al colegio.

`revision` y `updated_at` se mantienen por trigger. El guardado filtra por la revisión leída y rechaza sobrescrituras si otra pestaña actualizó el registro. No se permite modificar datos personales ni eliminar filas desde el panel. Archivar es reversible y conserva el historial de la solicitud; notas/estado no tienen un registro de auditoría separado en esta versión.

Para revocar el acceso, el propietario del proyecto puede retirar la fila correspondiente de `jean_piaget_admins` desde Supabase. No editar `user_metadata` para conceder permisos. El panel no gestiona usuarios ni modifica configuración de las otras aplicaciones.

Verificación del panel: consultas SQL con rol authenticated y JWT de administrador/no administrador dentro de una transacción revertida; lectura/actualización, privacidad del hash, restricción de columnas y conflicto de revisión comprobados. Flujo de interfaz probado con respuestas simuladas y datos sintéticos; la contraseña real la introduce el titular al acceder.
