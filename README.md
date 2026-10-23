# Manual de procedimientos · Construmac

Sitio web estático (HTML, CSS y JavaScript, sin compilación ni servidor) con los procedimientos operativos del área: reportes de cotizaciones, Market Share, junta trimestral, acuerdos de venta, CRM, cambio de precios, facturación, VPN, archivos esenciales y videos.

Cada procedimiento inicia desde el paso cero, incluye sus propios accesos (URL de Extend, CRM o Panjiva, rutas, correos), avisos, lista de verificación final y el texto original del manual. La distribución de sucursales por zona está en Recursos y en la Junta trimestral.

## Antes de publicar: seguridad

El contenido incluye rutas internas, direcciones de sistemas, correos y códigos de uso corporativo.

- Un sitio de GitHub Pages es accesible para cualquier persona que tenga el enlace, salvo que la organización use **GitHub Enterprise Cloud** con publicación privada (solo personas con acceso de lectura al repositorio pueden verlo).
- Antes de publicar, la organización debe autorizar la divulgación del contenido y elegir el mecanismo de acceso adecuado.
- El sitio **no** pide, guarda ni muestra contraseñas, tokens ni cookies. Los enlaces a SharePoint, Extend y CRM pueden pedir inicio de sesión corporativo; eso es normal.
- El archivo `index.html` incluye `noindex, nofollow` para pedir a los buscadores que no lo indexen, pero eso no restringe el acceso.

## Estructura

```
/
├── index.html            Estructura base (barra superior, menú, buscador, contenedor de vistas)
├── css/styles.css        Estilos, diseño responsive e impresión
├── js/procedures.js      CONTENIDO: procedimientos, recursos, correos, sistemas y zonas
├── js/utils.js           Utilidades: iconos, almacenamiento local, copiar, normalización de texto
├── js/search.js          Índice y buscador global (Ctrl/⌘ + K)
├── js/navigation.js      Rutas (#/…) y menú lateral
├── js/app.js             Vistas, vista guiada, favoritos, historial, zonas
├── assets/icons/         Favicon
└── README.md
```

No hay dependencias externas: funciona sin conexión a servicios de terceros. Todas las rutas son relativas, por lo que funciona en `https://usuario.github.io/repositorio/`.

## Publicar en GitHub Pages

1. **Crear el repositorio.** En GitHub, selecciona **New repository**, asigna un nombre y elige la visibilidad que autorice la organización.
2. **Añadir los archivos.** Sube el contenido de esta carpeta a la raíz del repositorio (con **Add file → Upload files** o con `git push`). `index.html` debe quedar en la raíz, junto a las carpetas `css`, `js` y `assets`.
3. **Ir a Settings → Pages** en el repositorio.
4. **Configurar la publicación.** En **Build and deployment**, elige **Source: Deploy from a branch**, la rama (por ejemplo `main`) y la carpeta **/(root)**. Guarda.
5. **Abrir la dirección generada.** GitHub muestra la URL del sitio en esa misma página cuando termina la publicación (puede tardar unos minutos).
6. **Confirmar el funcionamiento:**
   - Busca `1017`, `EPC`, `Guadalajara` y `Tipo de cambio`; cada búsqueda debe llevar al procedimiento correcto.
   - Abre directamente `…/#/procedimientos/facturas` y recarga la página: debe seguir en Facturación.
   - Abre `…/#/zonas`, escribe “Guadalajara” y verifica que muestre la zona Occidente.

## Uso

- **Buscar:** barra superior o `Ctrl + K` / `⌘ + K`. Ignora mayúsculas y acentos, y filtra por categoría y sistema. `Esc` cierra.
- **Vista completa / vista guiada:** la guiada muestra un paso a la vez (también con las flechas ← →).
- **Favoritos e historial:** se guardan en el `localStorage` de cada navegador. No se sincronizan entre equipos ni navegadores.
- **Distribución de zonas:** en Recursos (`#/zonas`) y dentro de la Junta trimestral; incluye un buscador de sucursales.
- **Rutas de Windows:** se muestran como texto copiable; el navegador no puede abrir carpetas locales. El usuario `bdiazd` corresponde al equipo de referencia y puede cambiar en otros equipos.

Rutas disponibles: `#/`, `#/procedimientos`, `#/procedimientos/<id>`, `#/procedimientos/<id>/paso-<n>`, `#/procedimientos/<id>/fase-<n>`, `#/categoria/<id>`, `#/favoritos`, `#/herramientas`, `#/directorio`, `#/zonas`, `#/sistemas/extend`, `#/sistemas/crm`.

## Editar o agregar procedimientos

Todo el contenido está en `js/procedures.js`; el menú, las tarjetas, el buscador y los índices se generan a partir de él.

1. Agrega un objeto al arreglo `PROCEDURES` con `id`, `title`, `category`, `icon`, `systems`, `objective`, `summary`, `keywords`, `requirements`, `notices`, `resources`, `phases`, `verification`, `faq` y `source`.
2. Cada fase tiene `title` y `steps`. Cada paso tiene `t` (texto) y, si aplica, `v` (valores copiables con `url()`, `path()`, `email()`, `code()`, `ip()`, `example()`), `warn`, `pend` (información pendiente de confirmar) o `note`.
3. En los textos, `**texto**` marca un botón, campo o menú literal, y `` `texto` `` un valor o código.
4. Agrega el `id` a `ORDER` y, si debe aparecer en el menú lateral, a `MENU`.

La numeración y el total de pasos se calculan automáticamente.

## Identidad visual

Paleta definida en variables CSS (`:root` en `css/styles.css`): rojo `#F23630`, blanco `#FFFFFF`, gris oscuro `#363636`, gris de fondo `#F5F5F5`, separadores `#E5E7EB` y texto secundario `#64748B`. El rojo `#F23630` se usa en acentos, barras e iconos; para botones y textos pequeños se usa un tono más oscuro (`#D42A24` / `#C8231D`) que cumple el contraste mínimo de accesibilidad (WCAG AA). No se incluye logotipo: la cabecera usa el nombre “CONSTRUMAC” en texto.

## Información pendiente de confirmar

El manual original no especifica estos puntos; el sitio los señala sin inventar pasos:

- **Actualizar información en CRM:** qué campos se actualizan, cómo se guarda y cómo se valida.
- **Cambiar precios:** campo del precio nuevo, autorización, confirmación y comprobación; posible opción intermedia “Seleccionar” después de “Acciones”.
- **Facturas:** la relación entre “Regularizar diferencias de cambio” y el tipo de impuesto.
- **Junta trimestral:** ruta exacta de “Reporte de ventas”.
