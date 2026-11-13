# Instrucciones para Claude en este proyecto

Web y área privada de Bungy System SL (rigging para cine y TV, Madrid). Lee `README.md` (estructura) y `decisiones.md` (contexto con los dueños) antes de tocar nada.

## Reglas

- Los archivos que se editan son `fuente/bungy-portada.html` y `fuente/bungy-app.html`. `salida/` se regenera con `python3 build.py`; no lo edites a mano. Ejecuta `build.py` después de cada cambio y antes de hacer commit.
- Todo es HTML, CSS y JS en archivos únicos, sin frameworks ni dependencias. No introduzcas un build (npm, bundlers) salvo que Pablo lo pida.
- Bilingüe: inglés por defecto, español con el botón EN/ES. En la web, cada texto nuevo lleva `data-i="clave"` con el inglés en el HTML y el español en el diccionario `ES`. En la app, el texto va en español y el inglés en `EN_WORDS` o `EN_RULES`.
- Colores de marca: rojo y negro (variables en `:root`). Estilo de referencia: biefec.com. Todo debe funcionar en móvil (probado en iPhone SE, iPhone 13 y Pixel 7) y en escritorio.
- La navegación entre páginas no debe depender de los anclas nativas del navegador: usa `nav('#tienda')` / `nav('#web')` y la delegación de clics ya existente.
- Fotos y vídeos actuales son de Pexels y provisionales. Al poner material real, sustituye las URL `images.pexels.com` / `videos.pexels.com`.
- Datos del área privada: inventados. No inventes datos "reales" de la empresa (teléfonos, seguros, precios); déjalos marcados como pendientes.
- Idioma de trabajo con Pablo: español.

## Comprobación mínima tras un cambio

1. `python3 build.py` sin errores.
2. Abrir `salida/bungy-system-web-completa.html`: entrada → Tienda → botón "Qué es Bungy" en cabecera → "Área privada" → cambiar EN/ES. Nada roto en móvil (ventana estrecha).
3. Si hay Playwright: `node pruebas/pages.js`.
