# Integraciones y automatización — Erizonn Media

> Integraciones y automatización de procesos en Madrid: ERP y Shopify sincronizados, WhatsApp Business, n8n, reservas y pagos, con historial y alertas.

Versión HTML: https://www.erizonn.com/servicios/integraciones-automatizacion

Integraciones y automatización para que tus sistemas hablen entre sí. En Erizonn conectamos tu ERP con Shopify, tu web con tus reservas y pagos, y tu calendario con WhatsApp. Las sincronizaciones críticas llevan historial, reintentos y alertas, para que sepas qué se ha sincronizado y qué hay que revisar.

## Qué incluye

Cada integración se adapta a tus sistemas y a cómo trabaja tu equipo. Estas son las piezas que solemos construir.

- **ERP y Shopify sincronizados:** Stock y precios desde tu ERP o el catálogo de tu proveedor, y pedidos de vuelta al ERP. Productos emparejados por EAN o SKU, en una o varias tiendas.
- **Panel de sincronización:** Historial de cada ejecución, productos que solo existen en uno de los dos sistemas, discrepancias con corrección en un clic y exportación a CSV.
- **Webhooks y APIs:** Recibimos eventos de Shopify, Stripe o Cal.com con su firma verificada, descartamos duplicados y reintentamos si el otro sistema no responde.
- **WhatsApp Business oficial:** Conexión con la Cloud API de Meta: mensajes entrantes, estados de entrega y lectura, y una bandeja para responder en tiempo real desde tu número.
- **n8n y tareas programadas:** Flujos que unen Google Calendar, Google Sheets y mensajería: recordatorios automáticos, leads de tus formularios en una hoja e informes programados.
- **Reservas y pagos conectados:** Cal.com y Stripe en tu web o plataforma: la reserva llega a tu panel, el pago activa el acceso y los cambios y cancelaciones se sincronizan.

## Casos de uso: Dónde se nota la diferencia

Escenarios habituales, no clientes concretos. Los proyectos más parecidos al tuyo te los enseñamos en una llamada.

- **Tienda online con el stock de un mayorista:** El stock del proveedor se actualiza en Shopify cada pocos minutos. Si un producto no se empareja, aparece en el panel para revisarlo en vez de descuadrar el inventario.
- **Canal mayorista conectado al ERP:** Las tarifas por nivel de cliente se calculan con los precios del ERP. Cada pedido B2B se envía al ERP, y su número de pedido y las incidencias quedan anotados en Shopify.
- **Negocio con citas o clases:** Un flujo de n8n lee tu calendario, busca al cliente en Google Sheets y le envía un recordatorio por WhatsApp antes de cada cita o clase, con una plantilla aprobada por Meta.
- **Venta con reserva y pago online:** Quien reserva una llamada en Cal.com aparece en tu panel como lead. Cuando paga con Stripe, su acceso se activa solo, y si cambia o cancela la cita, el panel se actualiza.

## Cómo lo hacemos: Integraciones preparadas para cuando algo falla

- **Primero, el mapa de datos:** Antes de programar definimos qué sistema manda en cada dato (stock, precio, pedido) y cómo se identifica cada producto.
- **Pruebas sin tocar producción:** Desarrollamos con datos simulados y entornos de prueba, para que los ensayos no afecten a tu stock ni a tus pedidos reales.
- **Tolerancia a fallos:** Reintentos automáticos, bloqueo de ejecuciones simultáneas y un interruptor de emergencia para pausar la sincronización si algo no cuadra.
- **Vigilancia en producción:** Comprobaciones de salud, detección de procesos atascados y avisos por email o Telegram, con registro de incidencias y guías de actuación.

Tecnologías habituales: Shopify Admin GraphQL API; Node.js y TypeScript; PostgreSQL; WhatsApp Business Cloud API; n8n; Google Calendar, Sheets y Apps Script; Cal.com; Stripe; Telegram Bot API; Resend.

## Preguntas frecuentes

### ¿Qué necesitáis para conectar mi ERP con Shopify?

Acceso a la API de tu ERP o de tu proveedor y su documentación. Con eso revisamos qué datos expone, cómo identifica los productos (EAN o SKU) y qué sistema manda en cada dato, y te proponemos qué sincronizar y en qué sentido. Si no tiene API, lo estudiamos contigo antes de proponerte nada.

### ¿Cada cuánto se sincronizan los datos?

Depende del dato y de lo que permita la API. Los pedidos pueden enviarse en cuanto se crean, mediante webhooks. El stock y los precios suelen ir en tareas programadas, con una frecuencia que fijamos según el volumen de productos, agrupando los cambios para no saturar ningún sistema.

### ¿Qué pasa si la sincronización falla?

Los cortes puntuales se reintentan solos. Si el error persiste, queda registrado en el historial y la integración puede enviarte un aviso por email o Telegram. Además, un interruptor de emergencia permite pausar la sincronización mientras se revisa.

### ¿Usáis la API oficial de WhatsApp?

Sí. Planteamos las automatizaciones sobre la Cloud API de WhatsApp Business, la vía oficial de Meta. Pasadas 24 horas desde el último mensaje del cliente, tu negocio solo puede escribirle con plantillas aprobadas por Meta. No recomendamos automatizar WhatsApp Web: es frágil y puede acabar en el bloqueo de tu número.

### ¿n8n o desarrollo a medida?

Depende del flujo. n8n encaja para unir calendario, hojas de cálculo y mensajería con rapidez y con cada paso a la vista. Para datos críticos como stock, precios o pedidos, preferimos un servicio a medida con historial, reintentos y alertas.

Contacto: apps@erizonn.com · +34 910 626 607.
