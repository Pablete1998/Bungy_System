# Bungy System · web nueva (demo)

Web de Bungy System SL (rigging para cine y televisión, Madrid) con tres partes:

1. **Entrada**: la persona elige entre "Qué es Bungy" y "Tienda".
2. **Qué es Bungy**: servicios, trabajos, proceso, seguridad, contacto.
3. **Tienda**: alquiler de motores y venta de plataformas, con panel de disponibilidad que baja "colgado de dos motores".
4. **Área privada** (botón en la cabecera): demo con tres perfiles (cliente, empleado, administración), con proyectos, agenda, horas, almacén, lista de carga, facturas y gastos. Datos inventados, no guarda nada.

Todo es HTML, CSS y JavaScript sin frameworks ni dependencias que instalar. Bilingüe: inglés por defecto y español con el botón EN/ES.

## Archivos

```
fuente/bungy-portada.html   Web pública (entrada + Qué es Bungy + Tienda). Aquí se edita la web.
fuente/bungy-app.html       Área privada. Aquí se edita la app.
build.py                    Junta las dos y genera los archivos finales en salida/.
salida/                     Lo que se publica (no editar a mano, se regenera con build.py):
  bungy-system-web-completa.html   web + área privada en un solo archivo
  portada.html                     solo la web pública
  area-privada.html                solo el área privada
pruebas/                    Pruebas automáticas con Playwright (opcional).
decisiones.md               Qué se decidió con los dueños y por qué, y qué falta.
CLAUDE.md                   Instrucciones para trabajar en este proyecto con Claude.
```

## Cómo trabajar

1. Edita `fuente/bungy-portada.html` o `fuente/bungy-app.html`.
2. Ejecuta `python3 build.py` (necesita Python 3, nada más).
3. Abre `salida/bungy-system-web-completa.html` en el navegador y comprueba.
4. Sube los cambios a GitHub (`git add -A && git commit -m "..." && git push`).

Para ver los cambios al momento sin regenerar, puedes abrir directamente `fuente/bungy-portada.html`: el botón "Área privada" no funcionará, el resto sí.

### Dónde está cada cosa en `bungy-portada.html`

- `<style>` al principio: todo el CSS. Los colores de marca están en `:root` (`--red`, `--night`...).
- HTML de las páginas: bloques con `data-only="web"` (Qué es Bungy) o `data-only="shop"` (Tienda). El código enseña solo los de la página activa.
- Al final, `<script>`: navegación entre páginas (`route`, `nav`), efectos (grano, cortina, cursor, contadores), el panel de disponibilidad (`#askrig`) y los textos en español en el diccionario `ES`. Cada texto visible tiene un `data-i="clave"`; el inglés está en el HTML y el español en `ES[clave]`.
- Fotos y vídeos: enlaces a Pexels (licencia libre), marcados como provisionales. Se cambian por fotos reales de Bungy buscando `images.pexels.com` y `videos.pexels.com`.

### Dónde está cada cosa en `bungy-app.html`

- Datos de ejemplo al principio del `<script>`: `CLIENTS`, `EMPLOYEES`, `ITEMS` (almacén por familias y tallas), `TEMPLATES` (plantillas de lista de carga), `PROJECTS`, `AGENDA`, `HOURS`, `INVOICES`, `EXPENSES`.
- La app está escrita en español; el inglés se traduce con el diccionario `EN_WORDS` y las reglas `EN_RULES`.
- Vistas por perfil: funciones `c*` (cliente), `e*` (empleado), `a*` (administración), y `loadCard` (lista de carga).

## Publicar en internet

Lo más sencillo es **Vercel** conectado a este repositorio: cada `git push` publica solo.

1. En vercel.com, "Add New Project", importar este repositorio.
2. Framework: "Other". Sin comando de build. Output directory: `salida`.
3. Para que la web abra en la raíz, el archivo `salida/index.html` tiene que existir: `build.py` ya lo copia desde `bungy-system-web-completa.html`.
4. Cuando los dueños quieran el dominio bungysystem.com, se apunta desde Arsys (donde está el dominio) a Vercel.

## Pruebas (opcional)

Con Node y Playwright instalados (`npm i -g playwright && npx playwright install chromium`), desde `pruebas/`:

```
node pages.js      # navegación entrada / Tienda / Qué es Bungy en escritorio y móvil
node fulltest.js   # recorrido completo, incluida el área privada
node ldtest.js     # lista de carga
```

Las pruebas abren `../salida/...` o un archivo de prueba; revisa la ruta al principio de cada script.

## Lo que falta para que sea una web real

Ver `decisiones.md`. En resumen: textos y fotos reales, datos de contacto y seguros, catálogo real de motores y plataformas, formulario conectado a un correo, y, para el área privada, usuarios y base de datos (se habló de Supabase).
