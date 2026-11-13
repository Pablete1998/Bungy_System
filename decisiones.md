# Decisiones tomadas y pendientes

Resumen de lo hablado con Paula Sanz (que lleva el proyecto con los dueños de Bungy System) entre el 21 de octubre y el 13 de noviembre de 2026.

## La empresa

- Bungy System SL, Madrid (C/ Belice 17). 30 años montando estructuras y pruebas para TV, cine, teatro, eventos y publicidad.
- Los dueños quieren centrar la empresa en **cine y televisión**. El cliente que buscan son **productoras de cine, sobre todo extranjeras**. Bungy trabaja también fuera de España: la web no debe limitarse a "rodar en España".
- Además del montaje, **alquilan motores** (polipastos eléctricos para colgar cargas) y **venden plataformas** que fabrican para cámara y escenario (las plataformas no se alquilan).
- Web antigua: bungysystem.com, HTML estático en Arsys. El dominio está en Arsys.

## La web

- Bilingüe, inglés por defecto y español. Colores de marca rojo y negro. Referencia de estilo: biefec.com.
- Tres páginas: una entrada para elegir, y al mismo nivel "Qué es Bungy" y "Tienda". En la cabecera de cada una, junto a "Área privada", un botón para pasar a la otra.
- Efectos "de cine" pedidos por Paula: grano, viñeta, cortina al cambiar de página, cursor propio, títulos que entran letra a letra, contadores, marcador REC en la portada. Todos se desactivan si el sistema pide menos movimiento.
- En la Tienda, "Consultar disponibilidad" abre un panel que baja colgado de dos motores (física de muelle) en vez de llevar al formulario.
- Fotos y vídeos: de Pexels, provisionales, elegidos por descripción. Hay que sustituirlos por material real de Bungy.

## El área privada

- Tres perfiles: cliente (sus proyectos, avance, documentos, facturas en PDF), empleado (agenda con calendario, trabajos, material, horas) y administración (todo, más almacén, planificación, validación de horas, facturas, gastos, personas).
- **Lista de carga** (añadida el 9 de noviembre): es la respuesta al problema real de la empresa: calculan a ojo qué llevar al plató y vuelven a la nave por olvidos, y no saben qué llevaron a trabajos pasados. Cada trabajo tiene su lista por familias y tallas (grapas fijas, grapas giratorias, tubos, truss, eslingas, motores, cricas, cables, cuerdas, cordinos), con plantillas por tipo de trabajo, disponibilidad por fechas, modo carga (marcar lo que sube a la furgoneta) y vuelta (marcar lo que entra). Los trabajos terminados guardan lo que se llevó. La usan equipo y administración.
- Todo son datos inventados: clientes, personas, cifras, tallas y cantidades.

## Qué falta para que sea real

1. Textos definitivos, fotos y vídeos propios, teléfono, correo, datos de seguros y certificaciones.
2. Catálogo real de motores (capacidad, unidades) y plataformas (medidas, carga, fotos, precio o "a presupuesto").
3. Tallas y cantidades reales del almacén para la lista de carga (una foto del almacén o un listado sirve para empezar).
4. Formulario de contacto conectado a un correo (hoy no envía nada).
5. Publicar: GitHub + Vercel (ver README). Después, apuntar bungysystem.com desde Arsys.
6. Área privada real: usuarios, base de datos y permisos. Se habló de **Supabase** (proyecto separado, región Frankfurt) y de hacerlo por fases: primero el perfil de empleado (agenda, horas, lista de carga), luego proyectos y clientes, al final facturas (o conectar con su programa de facturación).
