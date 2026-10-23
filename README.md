# Manual de procedimientos · Construmac

Sitio web estático (HTML, CSS y JavaScript, sin compilación ni servidor) con los procedimientos operativos del área: reportes de cotizaciones, Market Share, junta trimestral, acuerdos de venta, CRM, cambio de precios, facturación, VPN, archivos esenciales, distribución de zonas y videos.

## Acceso con contraseña

El sitio pide una contraseña antes de mostrar cualquier contenido.

- Todo el contenido (pasos, enlaces, correos, rutas y códigos) está **cifrado** en `js/procedures.enc.js` con AES-256-GCM. La clave se deriva de la contraseña con PBKDF2-SHA256 (600 000 iteraciones).
- La contraseña **no** está escrita en ningún archivo del sitio. Sin ella, el contenido no se puede leer, ni siquiera abriendo el código fuente o descargando los archivos del repositorio.
- “Recordar en este equipo” guarda la clave en ese navegador para no volver a pedir la contraseña. “Cerrar sesión” (al pie del menú lateral) la borra.
- Requiere `https` (GitHub Pages ya lo usa) o abrir `index.html` directamente desde el equipo.

Límites: la protección depende de que la contraseña no se comparta y no sea fácil de adivinar. No hay usuarios individuales ni registro de accesos.

## Estructura

```
/
├── index.html              Estructura base y pantalla de contraseña
├── css/styles.css          Estilos, diseño responsive e impresión
├── js/procedures.enc.js    CONTENIDO CIFRADO
├── js/gate.js              Pantalla de contraseña, descifrado y carga del resto
├── js/utils.js             Utilidades: iconos, almacenamiento local, copiar, normalización de texto
├── js/search.js            Índice y buscador global (Ctrl/⌘ + K)
├── js/navigation.js        Rutas (#/…) y menú lateral
├── js/app.js               Vistas, vista guiada, favoritos, historial, zonas
├── assets/icons/           Favicon
└── README.md
```

No hay dependencias externas. Todas las rutas son relativas, por lo que funciona en `https://usuario.github.io/repositorio/`.

La versión editable del contenido (`procedures.js`) y la herramienta para cifrarlo (`cifrar.html`) están en la carpeta `privado/`, que **no se sube** al repositorio.

## Publicar en GitHub Pages

1. **Crear el repositorio.** En GitHub, selecciona **New repository**, asigna un nombre y elige la visibilidad que autorice la organización.
2. **Añadir los archivos.** Sube el contenido de la carpeta `sitio/` a la raíz del repositorio (con **Add file → Upload files** o con `git push`). `index.html` debe quedar en la raíz, junto a las carpetas `css`, `js` y `assets`. No subas la carpeta `privado/`.
3. **Ir a Settings → Pages** en el repositorio.
4. **Configurar la publicación.** En **Build and deployment**, elige **Source: Deploy from a branch**, la rama (por ejemplo `main`) y la carpeta **/(root)**. Guarda.
5. **Abrir la dirección generada.** GitHub muestra la URL del sitio en esa misma página cuando termina la publicación (puede tardar unos minutos).
6. **Confirmar el funcionamiento:**
   - Debe aparecer la pantalla de contraseña; una contraseña incorrecta muestra “Contraseña incorrecta”.
   - Ingresa la contraseña y busca “Factura” y “Tipo de cambio”; cada búsqueda debe llevar al procedimiento correcto.
   - Abre directamente `…/#/procedimientos/facturas` y recarga la página: debe seguir en Facturación.

Si antes publicaste una versión sin contraseña en un repositorio público, el contenido anterior sigue en el historial de ese repositorio. Para retirarlo, publica esta versión en un repositorio nuevo y elimina el anterior.

## Uso

- **Buscar:** barra superior o `Ctrl + K` / `⌘ + K`. Ignora mayúsculas y acentos, y filtra por categoría y sistema. `Esc` cierra.
- **Vista completa / vista guiada:** la guiada muestra un paso a la vez (también con las flechas ← →).
- **Favoritos e historial:** se guardan en el `localStorage` de cada navegador. No se sincronizan entre equipos ni navegadores.
- **Distribución de zonas:** en Recursos (`#/zonas`) y dentro de la Junta trimestral; incluye un buscador de sucursales.
- **Rutas de Windows:** se muestran como texto copiable; el navegador no puede abrir carpetas locales. El nombre de usuario de la ruta corresponde al equipo de referencia y puede cambiar en otros equipos.

Rutas disponibles: `#/`, `#/procedimientos`, `#/procedimientos/<id>`, `#/procedimientos/<id>/paso-<n>`, `#/procedimientos/<id>/fase-<n>`, `#/categoria/<id>`, `#/favoritos`, `#/herramientas`, `#/directorio`, `#/zonas`, `#/sistemas/extend`, `#/sistemas/crm`.

## Editar el contenido o cambiar la contraseña

1. Edita `privado/procedures.js` (las instrucciones están en `privado/LEEME.md`).
2. Abre `privado/cifrar.html` en Chrome o Edge, selecciona `procedures.js` y escribe la contraseña (la misma o una nueva).
3. Sube el `procedures.enc.js` descargado a la carpeta `js/` del repositorio, reemplazando el anterior.

Al cambiar la contraseña, los equipos que la tenían recordada vuelven a pedirla.

## Identidad visual

Paleta definida en variables CSS (`:root` en `css/styles.css`): rojo `#F23630`, blanco `#FFFFFF`, gris oscuro `#363636`, gris de fondo `#F5F5F5`, separadores `#E5E7EB` y texto secundario `#64748B`. El rojo `#F23630` se usa en acentos, barras e iconos; para botones y textos pequeños se usa un tono más oscuro (`#D42A24` / `#C8231D`) que cumple el contraste mínimo de accesibilidad (WCAG AA). No se incluye logotipo: la cabecera usa el nombre “CONSTRUMAC” en texto.
