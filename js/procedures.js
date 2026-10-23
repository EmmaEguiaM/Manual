(function () {
  'use strict';

  var BASE = 'C:\\Users\\bdiazd\\OneDrive - CONSTRUMAC SAPI DE CV\\Documentos\\Archivos';

  var P = {
    base: BASE,
    reportes: BASE + '\\Reportes Cotizaciones (Semanal)\\Reportes',
    marketShare: BASE + '\\Market Share',
    gastos: BASE + '\\Gastos',
    facturas: BASE + '\\Facturas 2026\\Mensual',
    junta: BASE + '\\Junta Trimestral',
    presentaciones: BASE + '\\Junta Trimestral\\Presentaciones'
  };

  var U = {
    crm: 'https://ecrmconstrumac.eetcld.com/',
    panjiva: 'https://es.panjiva.com/account/login',
    extend: 'https://conerp.eetcld.com:810/infor/',
    portales: 'https://construmac-my.sharepoint.com/:x:/p/ajimenezm/IQDJukJN3z4DTYElCq67ELuZAY5BRkxHVj79r2rh1NbM0Tg?e=3p1RGB',
    reporte: 'https://construmac-my.sharepoint.com/:x:/p/ajimenezm/IQB9sm1KlCkjS7dTbFCw8wobASxvFiHwt2UlOcvsxPv91MA?e=2IacuN',
    reportes: 'https://construmac-my.sharepoint.com/:f:/p/jeguia/IgC7GR7ERGY5S7EYArtl0v-3ATOmv5vw2tyxzC-j82Ft8EA?e=PFDGyq',
    marketShare: 'https://construmac-my.sharepoint.com/:f:/p/jeguia/IgCPiqbEhzH_QqqjdkzWnnNKAefh9GHtVoBHlDniLbADzwA?e=dHPIGs',
    gastos: 'https://construmac-my.sharepoint.com/:x:/p/jeguia/IQDa0XrRi5TZSrBy60w4lCJ-Aet1Emsf5fkcaG-z8gmE9Ks?e=lEXYjW',
    facturas: 'https://construmac-my.sharepoint.com/:f:/p/jeguia/IgBovn-PRCdORZiTcSqL78gCAc_hfkMTyeO35knn9l8BgNc?e=CgK2eX',
    video: 'https://construmac-my.sharepoint.com/:f:/p/ajimenezm/IgD0HxwWuEtITYrQ56yRWjt0AcdIB9vqbhqrOzuWfkgJmpA?e=GLRBUr',
    junta: 'https://construmac-my.sharepoint.com/:f:/p/jeguia/IgBtJNxKvSCTQrjBZ_pWqzQHAW5uh26wi4Up8-VRJGjx10E?e=bSGuFr',
    juntaXlsx: 'https://construmac-my.sharepoint.com/:x:/p/sarjona/IQCYSHGzLZa9Q4Wxonz-Wn9ZAYCN34g6IVofZbnUuxg9pes?e=AkBWdb',
    presentaciones: 'https://construmac-my.sharepoint.com/:f:/p/jeguia/IgCJKUPm205zTre1GZe2g4T5AVhSnj_u5IDMO8MyNvENcDA?e=ug2Vg6'
  };

  var E = {
    rojano: 'arojano@construmac.com',
    ajimenez: 'ajimenez@construmac.com',
    proveedores: 'proveedores.construmac@resguardodigital.mx',
    adm: 'adm.construmac@resguardodigital.mx',
    maeq: 'kmartinezc@construmac.com',
    gaga: 'ggarciac@construmac.com'
  };

  var VPN_IP = '201.132.22.10';

  function url(label, href, copyLabel) { return { k: 'url', label: label, value: href, copyLabel: copyLabel || 'Copiar enlace' }; }
  function path(label, p) { return { k: 'path', label: label, value: p, copyLabel: 'Copiar ruta' }; }
  function email(label, e) { return { k: 'email', label: label, value: e, copyLabel: 'Copiar correo' }; }
  function account(label, e) { return { k: 'account', label: label, value: e, copyLabel: 'Copiar cuenta' }; }
  function code(label, c, copyLabel) { return { k: 'code', label: label, value: c, copyLabel: copyLabel || 'Copiar' }; }
  function ip(label, c) { return { k: 'ip', label: label, value: c, copyLabel: 'Copiar IP' }; }
  function example(label, c) { return { k: 'example', label: label, value: c, copyLabel: 'Copiar ejemplo' }; }
  function formula(label, c) { return { k: 'formula', label: label, value: c, copyLabel: 'Copiar fórmula' }; }

  var NO_PASSWORD = 'Este manual nunca solicita, guarda ni muestra contraseñas.';
  var EXTEND_PRIVATE = 'El manual indica que Extend no abre de otra forma.';
  var SEM43_WARN = '“SEM 43” es el nombre del archivo de referencia, no el nombre fijo del reporte vigente. Usa el archivo de la semana que estás trabajando.';
  var FX_NOTE = 'Supuesto: el tipo de cambio expresa MXN por unidad de la moneda extranjera. Si la cotización ya está en MXN, no se vuelve a convertir. No usar otras tasas ni criterios no documentados.';

  var CATEGORIES = [
    { id: 'reportes', name: 'Reportes y análisis', icon: 'chart' },
    { id: 'operaciones', name: 'Operaciones comerciales', icon: 'briefcase' },
    { id: 'administracion', name: 'Administración', icon: 'receipt' },
    { id: 'sistemas', name: 'Sistemas', icon: 'server' },
    { id: 'recursos', name: 'Recursos', icon: 'folder' }
  ];

  var ZONES = [
    { id: 'centro', name: 'Centro', branches: ['México', 'Teotihuacán', 'Villahermosa'] },
    { id: 'noroeste', name: 'Noroeste', branches: ['Hermosillo', 'Tijuana', 'Chihuahua', 'Los Cabos'] },
    { id: 'noreste', name: 'Noreste', branches: ['Monterrey'] },
    { id: 'occidente', name: 'Occidente', branches: ['Guadalajara', 'Durango', 'León'] },
    { id: 'sureste', name: 'Sureste', branches: ['Mérida', 'Playa del Carmen'] }
  ];

  var RESOURCES = [
    {
      id: 'carpeta-archivos', name: 'Carpeta principal “Archivos”', type: 'carpeta', path: P.base,
      description: 'Ubicación de la mayoría de los archivos importantes que se usan diariamente.',
      procs: ['archivos-esenciales']
    },
    {
      id: 'portales-mkt', name: 'Portales MKT.xlsx', type: 'excel', url: U.portales,
      description: 'Pestaña “Portales”: accesos a las plataformas necesarias. Pestaña “Archivos”: archivos importantes y compartidos, e información para la facturación.',
      procs: ['archivos-esenciales', 'market-share', 'facturas']
    },
    {
      id: 'reporte-cotizaciones', name: 'Reporte general de cotizaciones 2026 SEM 43.xlsx', type: 'excel', url: U.reporte,
      description: 'Archivo de referencia del reporte de cotizaciones. “SEM 43” es la semana del archivo de referencia; el número cambia cada semana.',
      procs: ['reporte-diario-cotizaciones', 'cierre-semanal-cotizaciones']
    },
    {
      id: 'carpeta-reportes', name: 'Carpeta “Reportes” · Reportes Cotizaciones (Semanal)', type: 'carpeta', path: P.reportes, url: U.reportes,
      description: 'Copias definitivas de los reportes semanales de cotizaciones.',
      procs: ['cierre-semanal-cotizaciones']
    },
    {
      id: 'carpeta-market-share', name: 'Carpeta “Market Share”', type: 'carpeta', path: P.marketShare, url: U.marketShare,
      description: 'Market Share de cada gerente para contrastar qué descripciones son aceptadas.',
      procs: ['market-share']
    },
    {
      id: 'carpeta-gastos', name: 'Carpeta “Gastos”', type: 'carpeta', path: P.gastos,
      description: 'Carpeta donde se encuentra Gastos MKT.xlsx.',
      procs: ['facturas']
    },
    {
      id: 'gastos-mkt', name: 'Gastos MKT.xlsx', type: 'excel', url: U.gastos, path: P.gastos, pathLabel: 'Carpeta que lo contiene',
      description: 'Registro de gastos: proveedor, forma de pago, cuenta contable, rubro, concepto y número de lote. En su pestaña “Prorrateo” se captura el gasto sin IVA y el prorrateo se calcula automáticamente.',
      procs: ['facturas']
    },
    {
      id: 'carpeta-facturas', name: 'Carpeta “Mensual” · Facturas 2026', type: 'carpeta', path: P.facturas, url: U.facturas,
      description: 'PDF y XML de las facturas, ordenados por mes.',
      procs: ['facturas']
    },
    {
      id: 'carpeta-junta', name: 'Carpeta “Junta Trimestral”', type: 'carpeta', path: P.junta, url: U.junta,
      description: 'Archivos de la junta trimestral.',
      procs: ['junta-trimestral']
    },
    {
      id: 'junta-xlsx', name: 'Junta trimestral.xlsx', type: 'excel', url: U.juntaXlsx,
      description: 'Archivo principal de la junta. La pestaña “GENERAL” ya está formulada y reúne MERCADO y PROYECTO.',
      procs: ['junta-trimestral']
    },
    {
      id: 'carpeta-presentaciones', name: 'Carpeta “Presentaciones”', type: 'carpeta', path: P.presentaciones, url: U.presentaciones,
      description: 'Presentaciones existentes de la junta trimestral; solo se actualizan.',
      procs: ['junta-trimestral']
    },
    {
      id: 'video-marketing', name: 'Cómo funciona el área de marketing de Construmac', type: 'video', url: U.video,
      description: 'Video explicativo del área de marketing. Se abre en su ubicación original de SharePoint.',
      procs: ['videos-capacitacion']
    }
  ];

  var CONTACTS = [
    { id: 'arturo-rojano', name: 'Arturo Rojano', email: E.rojano, role: 'Destinatario del reporte semanal de cotizaciones.', procs: ['cierre-semanal-cotizaciones'] },
    { id: 'karen-jimenez', name: 'Karen Jimenez', email: E.ajimenez, role: 'Va con copia en el reporte semanal de cotizaciones.', procs: ['cierre-semanal-cotizaciones'] },
    { id: 'cuenta-extend', name: 'Cuenta indicada para Extend', email: E.ajimenez, role: 'Cuenta de inicio de sesión (Azure AD) indicada en el manual para Extend. ' + NO_PASSWORD, procs: ['acuerdos-de-venta', 'facturas', 'cambiar-precios'], isAccount: true },
    { id: 'recepcion-proveedores', name: 'Recepción proveedores', email: E.proveedores, role: 'Recepción del PDF y XML de cada factura.', procs: ['facturas'] },
    { id: 'recepcion-administrativa', name: 'Recepción administrativa', email: E.adm, role: 'Recepción del PDF y XML de cada factura.', procs: ['facturas'] },
    { id: 'cargos-maeq', name: 'Cargos MAEQ', email: E.maeq, role: 'Notificación de cargos MAEQ (concepto, número de lote, PDF y XML).', procs: ['facturas'] },
    { id: 'cargos-gaga', name: 'Cargos GAGA', email: E.gaga, role: 'Notificación de cargos GAGA (concepto, número de lote, PDF y XML).', procs: ['facturas'] }
  ];

  var SYSTEMS = [
    {
      id: 'crm', name: 'CRM', kind: 'Sistema web', url: U.crm, icon: 'database', page: true,
      description: 'Cotizaciones (Construmac Sales > Quotes) y catálogo de familias y productos.',
      procs: ['reporte-diario-cotizaciones', 'cierre-semanal-cotizaciones', 'actualizar-crm'],
      access: [
        'Abrir el navegador web.',
        'Ingresar a la dirección del CRM (botón **Abrir** de esta página).',
        'Iniciar sesión con una cuenta corporativa autorizada.'
      ],
      notes: [{ type: 'info', text: NO_PASSWORD }]
    },
    {
      id: 'extend', name: 'Extend', kind: 'Sistema web', url: U.extend, icon: 'server', page: true,
      description: 'Conversión de cotizaciones (EPC), transacciones de facturas (CFG) y listas de precios de modelos.',
      procs: ['acuerdos-de-venta', 'facturas', 'cambiar-precios'],
      access: [
        'Abrir una pestaña privada o ventana de incógnito en el navegador. ' + EXTEND_PRIVATE,
        'Ingresar a la dirección de Extend (botón **Abrir** de esta página).',
        'Seleccionar **Azure AD**.',
        'Iniciar sesión con la cuenta corporativa autorizada. Cuenta indicada en el manual: `ajimenez@construmac.com`.'
      ],
      notes: [{ type: 'info', text: NO_PASSWORD }],
      faq: [{ q: '¿Qué hago si Extend no abre?', a: 'Ábrelo en una pestaña privada o ventana de incógnito. El manual indica que de otra forma no abre.' }]
    },
    {
      id: 'panjiva', name: 'Panjiva', kind: 'Sistema web', url: U.panjiva, icon: 'globe', page: false,
      description: 'Consulta de importaciones por clave arancelaria para el Market Share.',
      procs: ['market-share']
    },
    {
      id: 'vpn', name: 'Cisco Secure Client', kind: 'Aplicación de Windows', url: null, ip: VPN_IP, icon: 'shield', page: false,
      description: 'Conexión VPN corporativa.',
      procs: ['vpn']
    }
  ];

  var PROCEDURES = [
    {
      id: 'archivos-esenciales',
      title: 'Archivos esenciales',
      category: 'recursos',
      icon: 'folder',
      systems: ['Explorador de Windows', 'SharePoint'],
      objective: 'Identificar la ubicación de los archivos y portales que se usan a diario.',
      summary: 'Carpeta principal de trabajo y documento de accesos Portales MKT.',
      keywords: ['archivos', 'carpeta', 'OneDrive', 'Portales MKT', 'portales', 'pestaña Archivos', 'facturación', 'ruta', 'documentos'],
      requirements: [
        'Equipo con Windows y acceso al Explorador de archivos.',
        'Acceso a la carpeta de OneDrive “CONSTRUMAC SAPI DE CV” en el equipo.',
        'Cuenta corporativa con acceso a SharePoint de Construmac.'
      ],
      notices: [
        { type: 'info', text: 'El usuario “bdiazd” de las rutas pertenece al equipo de referencia. En otro equipo la ruta puede cambiar por el nombre de usuario de Windows o por la sincronización de OneDrive.' }
      ],
      resources: ['carpeta-archivos', 'portales-mkt'],
      phases: [
        {
          title: 'Ubicar archivos y accesos',
          steps: [
            { t: 'Abrir el **Explorador de archivos** de Windows.' },
            {
              t: 'Ubicar el directorio principal, donde está la mayoría de los archivos importantes de uso diario:',
              v: [path('Directorio principal', P.base)],
              note: 'Pega la ruta en la barra de direcciones del Explorador de archivos. Si no existe, revisa que el usuario de Windows y la carpeta de OneDrive correspondan a tu equipo.'
            },
            { t: 'Abrir el documento de accesos **Portales MKT.xlsx**:', v: [url('Portales MKT.xlsx', U.portales)] },
            { t: 'Identificar la pestaña **Portales**: contiene los accesos a las plataformas necesarias.' },
            { t: 'Identificar la pestaña **Archivos**: además de archivos importantes y compartidos, contiene la información para la facturación.' }
          ]
        }
      ],
      verification: [
        'Se localizó el directorio principal en el Explorador de archivos.',
        'Se abrió Portales MKT.xlsx.',
        'Se identificaron las pestañas “Portales” y “Archivos”.'
      ],
      faq: [
        { q: '¿Dónde está la información para la facturación?', a: 'En Portales MKT.xlsx, pestaña “Archivos”.' },
        { q: '¿Por qué la ruta no existe en mi equipo?', a: 'La ruta de referencia usa el usuario “bdiazd”. En otro equipo puede cambiar el usuario de Windows o la ubicación de OneDrive.' }
      ],
      source: [
        'La mayoría de los archivos importantes y que se usan diariamente se ubican en la siguiente dirección: “' + P.base + '”.',
        'Páginas relevantes se ubican en “Portales MKT.xlsx”. En la pestaña de portales están todos los necesarios. En la pestaña Archivos, aparte de archivos importantes y compartidos, está la información para la facturación.'
      ]
    },

    {
      id: 'reporte-diario-cotizaciones',
      title: 'Reporte diario de cotizaciones',
      shortTitle: 'Reporte de cotizaciones',
      category: 'reportes',
      icon: 'file-text',
      frequency: 'Diaria',
      systems: ['CRM', 'Excel', 'Correo'],
      objective: 'Recopilar las cotizaciones de cada día y registrar correctamente sus importes en MXN.',
      summary: 'Descarga de cotizaciones del CRM y registro diario en MXN.',
      keywords: ['cotizaciones', 'cotización', 'COT', 'quotes', 'CRM', 'tipo de cambio', 'divisa', 'MXN', 'moneda extranjera', 'Aydee Bautista', 'Download Template', 'Excel Templates', 'Construmac Sales', 'precio', 'reporte'],
      related: ['cierre-semanal-cotizaciones'],
      requirements: [
        'Cuenta corporativa autorizada para el CRM.',
        'Acceso al archivo vigente “Reporte general de cotizaciones”.',
        'Acceso al correo corporativo para consultar “Tipo de Cambio Hoy”.'
      ],
      notices: [
        { type: 'warn', text: SEM43_WARN },
        { type: 'info', text: 'El cierre de la semana (lunes) tiene su propio procedimiento: “Cierre semanal de cotizaciones”.' }
      ],
      resources: ['reporte-cotizaciones'],
      phases: [
        {
          title: 'Acceso al CRM',
          steps: [
            { t: 'Abrir el navegador web.' },
            { t: 'Ingresar al CRM:', v: [url('CRM', U.crm)] },
            { t: 'Iniciar sesión con una cuenta corporativa autorizada.', note: NO_PASSWORD }
          ]
        },
        {
          title: 'Descarga de cotizaciones',
          steps: [
            { t: 'En el CRM, seleccionar **Construmac Sales**.' },
            { t: 'Abrir **Quotes**.' },
            { t: 'Abrir **Excel Templates**.' },
            { t: 'Seleccionar **Download Template**.' },
            { t: 'Filtrar las cotizaciones por el día que corresponde al reporte.' }
          ]
        },
        {
          title: 'Registro en el reporte',
          steps: [
            {
              t: 'Abrir el archivo del reporte de cotizaciones. Archivo de referencia: **Reporte general de cotizaciones 2026 SEM 43.xlsx**.',
              v: [url('Reporte general de cotizaciones 2026 SEM 43.xlsx', U.reporte)],
              warn: SEM43_WARN
            },
            { t: 'Pasar la información del día al apartado **Reporte**, día por día.' }
          ]
        },
        {
          title: 'Conversión a MXN',
          steps: [
            { t: 'Antes de registrar el precio, verificar la divisa en la que se realizó cada cotización.' },
            { t: 'Revisar el correo **Tipo de Cambio Hoy**, que normalmente envía Aydee Bautista de forma diaria, y tomar el tipo de cambio de la fecha correspondiente.' },
            {
              t: 'Si la cotización está en moneda extranjera, multiplicar el importe por el tipo de cambio:',
              v: [formula('Fórmula', 'Importe en MXN = importe original en moneda extranjera × tipo de cambio aplicable')],
              note: FX_NOTE
            },
            { t: 'Registrar el importe en MXN en el reporte y verificarlo contra la cotización.' }
          ]
        }
      ],
      verification: [
        'Las cotizaciones del día están registradas en “Reporte”.',
        'Se verificó la divisa de cada cotización.',
        'Se usó el tipo de cambio de “Tipo de Cambio Hoy” de la fecha correspondiente.',
        'Todos los importes quedaron en MXN.',
        'Las fechas registradas son correctas.'
      ],
      faq: [
        { q: '¿De dónde sale el tipo de cambio?', a: 'Del correo “Tipo de Cambio Hoy”, que normalmente envía Aydee Bautista de forma diaria.' },
        { q: '¿Qué hago con una cotización que ya está en MXN?', a: 'Se registra tal cual; no se vuelve a convertir.' }
      ],
      source: [
        'CRM: ' + U.crm + ' — CRM > Construmac Sales > Quotes > Excel Templates > Download Template. Filtrar por día e ir pasando información por día a “Reporte”.',
        'Archivo “Reporte general de cotizaciones 2026 SEM 43.xlsx”.',
        'Para pasar el precio adecuado, se debe verificar la divisa en la que se realizó la cotización (revisar correo “Tipo de Cambio Hoy”, normalmente enviado por Aydee Bautista de forma diaria), multiplicar divisa por cantidad y poner en el reporte en MXN.'
      ]
    },

    {
      id: 'cierre-semanal-cotizaciones',
      title: 'Cierre semanal de cotizaciones',
      category: 'reportes',
      icon: 'calendar',
      frequency: 'Semanal · el lunes siguiente a la semana reportada',
      systems: ['CRM', 'Excel', 'Correo', 'SharePoint'],
      objective: 'Completar el reporte de la semana, enviarlo, archivar una copia definitiva y preparar el archivo de la semana siguiente.',
      summary: 'Completar el viernes, enviar a Arturo Rojano, archivar y preparar la nueva semana.',
      keywords: ['cierre', 'semanal', 'lunes', 'viernes', 'Arturo Rojano', 'Karen Jimenez', 'reporte semanal', 'número de semana', 'archivar', 'cotizaciones', 'COT', 'tipo de cambio', 'semana'],
      related: ['reporte-diario-cotizaciones'],
      requirements: [
        'Cuenta corporativa autorizada para el CRM.',
        'Archivo del reporte de la semana a cerrar (“Reporte general de cotizaciones …”).',
        'Acceso al correo corporativo.',
        'Acceso a la carpeta “Reportes” en OneDrive o SharePoint.'
      ],
      notices: [
        { type: 'warn', text: 'Antes de borrar los datos de la semana previa, confirma que la copia definitiva ya está guardada en la carpeta “Reportes”.' },
        { type: 'warn', text: SEM43_WARN }
      ],
      resources: ['reporte-cotizaciones', 'carpeta-reportes'],
      phases: [
        {
          title: 'Acceso al CRM',
          steps: [
            { t: 'Abrir el navegador web e ingresar al CRM:', v: [url('CRM', U.crm)] },
            { t: 'Iniciar sesión con una cuenta corporativa autorizada.', note: NO_PASSWORD },
            { t: 'En el CRM, seleccionar **Construmac Sales**.' },
            { t: 'Abrir **Quotes**.' },
            { t: 'Abrir **Excel Templates**.' },
            { t: 'Seleccionar **Download Template**.' }
          ]
        },
        {
          title: 'Completar la semana',
          steps: [
            {
              t: 'Abrir el archivo de la semana a cerrar. Archivo de referencia: **Reporte general de cotizaciones 2026 SEM 43.xlsx**.',
              v: [url('Reporte general de cotizaciones 2026 SEM 43.xlsx', U.reporte)],
              warn: SEM43_WARN
            },
            { t: 'El lunes de la semana siguiente, rellenar la información del viernes.' },
            { t: 'Comprobar que toda la semana esté registrada.' },
            {
              t: 'Para las cotizaciones en moneda extranjera, revisar el correo **Tipo de Cambio Hoy** (normalmente enviado por Aydee Bautista) y registrar el importe en MXN:',
              v: [formula('Fórmula', 'Importe en MXN = importe original en moneda extranjera × tipo de cambio aplicable')],
              note: FX_NOTE
            }
          ]
        },
        {
          title: 'Envío y archivo',
          steps: [
            {
              t: 'Con la semana completa, enviar el reporte por correo a Arturo Rojano, con copia a Karen Jimenez:',
              v: [email('Para · Arturo Rojano', E.rojano), email('CC · Karen Jimenez', E.ajimenez)],
              compose: { to: [E.rojano], cc: [E.ajimenez], label: 'Redactar correo (Para + CC)' }
            },
            {
              t: 'Guardar una copia del archivo completo en la carpeta de reportes:',
              v: [path('Ruta de la carpeta', P.reportes), url('Carpeta “Reportes” en SharePoint', U.reportes)]
            }
          ]
        },
        {
          title: 'Preparar la semana siguiente',
          steps: [
            { t: 'Confirmar que la copia completa quedó guardada en la carpeta “Reportes”.' },
            { t: 'En el archivo de trabajo, borrar únicamente los datos de la semana previa, conservando fórmulas y formato.' },
            { t: 'Cambiar el número de semana en el nombre del archivo (por ejemplo, de `SEM 43` a `SEM 44`).' }
          ]
        }
      ],
      verification: [
        'La semana completa, incluido el viernes, está registrada.',
        'Los importes en moneda extranjera se registraron en MXN.',
        'Se envió el reporte a Arturo Rojano con copia a Karen Jimenez.',
        'La copia completa está guardada en la carpeta “Reportes”.',
        'El archivo de trabajo quedó sin datos de la semana previa y con el número de semana actualizado.'
      ],
      faq: [
        { q: '¿Cuándo se cierra la semana?', a: 'El lunes de la semana siguiente: se rellena el viernes y, con la semana completa, se envía el reporte.' },
        { q: '¿A quién se envía el reporte?', a: 'A Arturo Rojano (arojano@construmac.com), con copia a Karen Jimenez (ajimenez@construmac.com).' }
      ],
      source: [
        'El lunes de cada semana próxima rellenar el del viernes y, al tener la semana completa, enviar a Arturo Rojano “' + E.rojano + '” con copia a Karen Jimenez “' + E.ajimenez + '”.',
        'Una vez el archivo esté completo, guardar copia en “' + P.reportes + '”.',
        'Finalmente, para la siguiente semana, borrar datos de semana previa y cambiar el número de semana del nombre del archivo.'
      ]
    },

    {
      id: 'market-share',
      title: 'Market Share — Panjiva',
      shortTitle: 'Market Share',
      category: 'reportes',
      icon: 'pie',
      systems: ['Panjiva', 'Excel', 'SharePoint'],
      objective: 'Obtener información de importaciones en Panjiva, contrastarla con el Market Share de cada gerente y descartar los registros que no corresponden a maquinaria nueva.',
      summary: 'Exportación de Panjiva por clave arancelaria y filtrado de equipo usado.',
      keywords: ['Panjiva', 'market share', 'clave arancelaria', 'importaciones', 'Export Results', 'Download File', 'subasta', 'auctioneers', 'equipo usado', 'maquinaria nueva', 'peso', 'precio', 'Gmail', 'gerente', 'Búsqueda Avanzada'],
      requirements: [
        'Cuenta corporativa autorizada para Panjiva.',
        'Clave arancelaria a consultar.',
        'Periodo de fechas del análisis.',
        'Acceso a la carpeta “Market Share”.'
      ],
      notices: [
        { type: 'warn', text: 'Antes de enviar una exportación a un correo externo (Gmail), confirma que su uso esté autorizado por la empresa.' }
      ],
      resources: ['portales-mkt', 'carpeta-market-share'],
      phases: [
        {
          title: 'Acceso a Panjiva',
          steps: [
            { t: 'Abrir el navegador web e ingresar a Panjiva:', v: [url('Panjiva', U.panjiva)] },
            { t: 'Iniciar sesión en Panjiva con la cuenta corporativa autorizada.', note: NO_PASSWORD }
          ]
        },
        {
          title: 'Búsqueda y exportación',
          steps: [
            { t: 'Seleccionar **Search**.' },
            { t: 'Abrir **Búsqueda Avanzada**.' },
            { t: 'En el campo **company or product name**, escribir la clave arancelaria.', note: 'Así lo indica el manual: la clave arancelaria se captura en el campo “company or product name”.' },
            { t: 'Especificar el periodo de fechas.' },
            { t: 'Presionar **Search**.' },
            { t: 'Desplazarse hacia abajo hasta **Export Results**.' },
            { t: 'Seleccionar **Download File**.' },
            {
              t: 'Si son muchos datos y la exportación se envía por correo, el manual indica capturar un correo de Gmail, porque los envíos no llegan al correo institucional.',
              warn: 'Confirma que el uso de un correo externo esté autorizado por la empresa antes de enviarle información.'
            }
          ]
        },
        {
          title: 'Filtrado',
          steps: [
            { t: 'Abrir la carpeta de Market Share:', v: [path('Ruta de la carpeta', P.marketShare), url('Carpeta “Market Share” en SharePoint', U.marketShare)] },
            { t: 'Contrastar los resultados con el Market Share de cada gerente para conocer qué descripciones son aceptadas.' },
            { t: 'Verificar que el peso y el precio concuerden: el análisis no aplica para equipo usado.' },
            { t: 'Descartar todo lo que diga **auctioneers** o **subasta**, ya que es equipo usado.' },
            {
              t: 'Como referencia, sacar el promedio de peso y de precios para identificar qué equipos son nuevos y cuáles no.',
              note: 'Los promedios son una referencia auxiliar; por sí solos no prueban si un equipo es nuevo o usado.'
            }
          ]
        }
      ],
      verification: [
        'Clave arancelaria y periodo de fechas correctos.',
        'Exportación descargada (o recibida en un correo autorizado).',
        'Descripciones contrastadas con el Market Share de cada gerente.',
        'Peso y precio consistentes con equipo nuevo.',
        'Registros de auctioneers/subasta descartados.'
      ],
      faq: [
        { q: '¿Por qué se descartan los registros de subasta?', a: 'Porque corresponden a equipo usado y el análisis no aplica para equipo usado.' },
        { q: '¿Cuál es la URL de Panjiva?', a: 'https://es.panjiva.com/account/login', v: [url('Panjiva', U.panjiva)] }
      ],
      source: [
        'Iniciar sesión > Search > Búsqueda Avanzada > Poner clave arancelaria en “company or product name” > Especificar fecha > Search > Bajar hasta “Export Results” > Download File > En caso de ser muchos datos, poner un correo Gmail para que se exporte, ya que no llegan al correo institucional.',
        'Filtrado: se debe contrastar con el market share de cada gerente para conocer qué descripciones son aceptadas. Así mismo, el peso y el precio deben concordar, ya que no aplica para equipo usado (' + P.marketShare + ').',
        'Razón por la que todo lo que diga auctioneers/subasta está descartado, ya que es equipo usado. Se puede hacer un promedio del peso y de los precios para así tener una referencia de qué equipos son nuevos y cuáles no.'
      ]
    },

    {
      id: 'junta-trimestral',
      title: 'Junta trimestral',
      category: 'reportes',
      icon: 'presentation',
      frequency: 'Al final de cada trimestre',
      systems: ['Excel', 'PowerPoint', 'SharePoint'],
      objective: 'Recopilar los datos mensuales y acumulados, organizar la información trimestral por zona y actualizar las presentaciones existentes.',
      summary: 'Actualizar Junta trimestral.xlsx, asignar zonas y reemplazar tablas en las presentaciones.',
      keywords: ['junta', 'trimestral', 'trimestre', 'Q4', 'presentaciones', 'PowerPoint', 'PPTX', 'GENERAL', 'MERCADO', 'PROYECTO', 'zonas', 'zona', 'sucursal', 'sucursales', 'Cambiar imagen', 'Desde el portapapeles', 'reporte de ventas', 'acumulado'],
      requirements: [
        'Acceso a la carpeta “Junta Trimestral” y a Junta trimestral.xlsx.',
        'Reporte de ventas mensual más reciente.',
        'Presentaciones existentes de la junta.',
        'Excel y PowerPoint.'
      ],
      notices: [
        { type: 'warn', text: 'La pestaña “GENERAL” ya está formulada adecuadamente. No muevas ni reemplaces sus fórmulas ni su estructura.' },
        { type: 'info', text: 'La indicación “Rellenar información correspondiente al Q4” pertenece al cierre documentado en el manual. En otros cierres, rellena el trimestre que corresponda.' }
      ],
      resources: ['carpeta-junta', 'junta-xlsx', 'carpeta-presentaciones'],
      phases: [
        {
          title: 'Localizar archivos',
          steps: [
            { t: 'Abrir el **Explorador de archivos** de Windows.' },
            { t: 'Abrir la carpeta “Junta Trimestral”:', v: [path('Ruta de la carpeta', P.junta), url('Carpeta “Junta Trimestral” en SharePoint', U.junta)] },
            { t: 'Abrir el archivo principal **Junta trimestral.xlsx**; todo se realiza desde este archivo.', v: [url('Junta trimestral.xlsx', U.juntaXlsx)] }
          ]
        },
        {
          title: 'Revisar reportes mensuales',
          steps: [
            { t: 'Localizar los reportes de ventas mensuales: en **Reporte de ventas** vienen todos los reportes mensuales.', pend: 'El manual no indica la ruta exacta de “Reporte de ventas”.' },
            { t: 'Usar el reporte más reciente que envíen como base para organizar la información.' },
            { t: 'Mostrar todas las tablas previas: el reporte reciente solo permite visualizar el mes en curso y el acumulado. Para verificar mes por mes, mostrar la tabla correspondiente.' },
            { t: 'No actualizar la información de meses anteriores: ya está verificada.' }
          ]
        },
        {
          title: 'Actualizar trimestre',
          steps: [
            { t: 'Determinar el trimestre que se va a actualizar.', note: 'En el manual la indicación es “Rellenar información correspondiente al Q4”; corresponde al cierre documentado y no es una regla para todos los trimestres.' },
            { t: 'Abrir la pestaña **GENERAL** de Junta trimestral.xlsx.' },
            { t: 'No mover la información de la pestaña **GENERAL**: ya se encuentra formulada adecuadamente.', warn: 'Mover o reemplazar celdas de “GENERAL” puede romper sus fórmulas.' },
            { t: 'Rellenar la información del trimestre con base en el reporte y su consolidación por zonas.', note: 'No se agregan fórmulas ni reglas de negocio que no estén en el archivo.' }
          ]
        },
        {
          title: 'Distribución de zonas',
          component: 'zones',
          steps: [
            { t: 'Asignar cada sucursal a su zona según la distribución documentada (tabla y buscador de esta sección).', component: 'zones' }
          ]
        },
        {
          title: 'Actualizar presentaciones',
          steps: [
            { t: 'Con toda la información recopilada, abrir la carpeta de presentaciones. Ya existen; solo se actualizan.', v: [path('Ruta de la carpeta', P.presentaciones), url('Carpeta “Presentaciones” en SharePoint', U.presentaciones)] },
            { t: 'Abrir la presentación que corresponde al cierre.' },
            { t: 'En Junta trimestral.xlsx, ubicar en la pestaña **GENERAL** la tabla o gráfica a copiar: ahí están los campos de **MERCADO** y **PROYECTO**.' },
            { t: 'Seleccionar la tabla o gráfica en Excel y copiarla.' },
            { t: 'En el PowerPoint, seleccionar la tabla existente que se va a actualizar.' },
            { t: 'Elegir la opción **Cambiar imagen**.' },
            { t: 'Seleccionar **Desde el portapapeles**.' },
            { t: 'Verificar que la tabla o gráfica nueva sustituyó a la anterior sin mover formato ni acomodo.' },
            { t: 'Repetir con el resto de las tablas y gráficas.' }
          ]
        },
        {
          title: 'Validación final',
          steps: [
            { t: 'Confirmar que el trimestre actualizado es el correcto.' },
            { t: 'Confirmar que la información de meses anteriores se conservó.' },
            { t: 'Confirmar la asignación de sucursales por zona.' },
            { t: 'Revisar que las fórmulas de **GENERAL** sigan intactas.' },
            { t: 'Confirmar que **MERCADO** y **PROYECTO** están actualizados y que Excel y PowerPoint coinciden.' },
            { t: 'Guardar los archivos actualizados en sus carpetas.' }
          ]
        }
      ],
      verification: [
        'Tablas mensuales consistentes con el reporte más reciente.',
        'Datos del trimestre correctos.',
        'Sucursales asignadas a la zona documentada.',
        'Fórmulas de “GENERAL” intactas.',
        'Presentaciones actualizadas (MERCADO y PROYECTO).'
      ],
      faq: [
        { q: '¿A qué zona pertenece Guadalajara?', a: 'Occidente.' },
        { q: '¿Hay que crear presentaciones nuevas?', a: 'No. Ya existen; solo se actualizan.' },
        { q: '¿Cuál es la forma más rápida de pasar las tablas?', a: 'Copiar la tabla o gráfica en Excel, seleccionar la existente en el PowerPoint y elegir “Cambiar imagen” > “Desde el portapapeles”. Así no hay que mover el formato.' }
      ],
      source: [
        'Carpeta: “' + P.junta + '”.',
        'En Reporte de ventas vienen todos los reportes mensuales; sin embargo, el más reciente que manden será por el cual se organiza la información, pero hay que mostrar todas las tablas previas, ya que solo envían para visualizar la del mes en curso y el acumulado. En caso de verificar mes por mes, mostrar la tabla.',
        'La información de mes a mes ya está verificada, por lo que no será necesario actualizarla.',
        'Todo se realiza desde el archivo “Junta trimestral.xlsx”. Toda la información de la pestaña “GENERAL” ya se encuentra formulada adecuadamente; evitar mover. Rellenar información correspondiente al Q4.',
        'Zonas — Centro: México, Teotihuacán, Villahermosa · Noroeste: Hermosillo, Tijuana, Chihuahua, Los Cabos · Noreste: Monterrey · Occidente: Guadalajara, Durango, León · Sureste: Mérida, Playa del Carmen.',
        'Al tener toda la información recopilada, se deberá pasar a presentaciones. Ya hay presentaciones existentes, por lo que solo es actualizar (“' + P.presentaciones + '”).',
        'El proceso más rápido es copiar las tablas del Excel, presionar en el PPTX la tabla ya existente y seleccionar “Cambiar imagen” > “Desde el portapapeles”. Así no hay que mover el formato ni acomodar. Al estar dividido todo en mercado y proyecto, en la pestaña “GENERAL” se encuentran ambos campos.'
      ]
    },

    {
      id: 'acuerdos-de-venta',
      title: 'Acuerdos de venta',
      category: 'operaciones',
      icon: 'file-check',
      frequency: 'Según solicitud',
      systems: ['Extend', 'Correo'],
      objective: 'Convertir una cotización en orden de venta (SO) en Extend y obtener el número de acuerdo de venta (EPC) para enviarlo al solicitante.',
      summary: 'Convertir la cotización (COT) en SO y obtener su número EPC.',
      keywords: ['EPC', 'COT', 'cotización', 'Sales Agreement Number', 'Convert to SO', 'Gatekeeper', 'Sales Quotes', 'CRM Quote ID', 'orden de venta', 'Azure AD', 'Extend', 'acuerdo de venta', 'incógnito'],
      requirements: [
        'Número de la cotización que se va a convertir.',
        'Cuenta corporativa autorizada para Extend (Azure AD).',
        'Navegador con pestaña privada o ventana de incógnito.',
        'Correo del solicitante.'
      ],
      notices: [
        { type: 'warn', text: 'Verifica la cotización seleccionada antes de usar “Convert to SO”.' },
        { type: 'info', text: '`EPC000000` y `COT-14475-7Q0W9` son formatos de ejemplo, no números reales.' }
      ],
      resources: [],
      phases: [
        {
          title: 'Acceso a Extend',
          steps: [
            { t: 'Abrir una pestaña privada o ventana de incógnito en el navegador.', note: EXTEND_PRIVATE },
            { t: 'Ingresar a Extend:', v: [url('Extend', U.extend)] },
            { t: 'Seleccionar **Azure AD**.' },
            { t: 'Iniciar sesión con la cuenta corporativa autorizada. Cuenta indicada en el manual:', v: [account('Cuenta de inicio de sesión', E.ajimenez)], note: NO_PASSWORD }
          ]
        },
        {
          title: 'Convertir la cotización',
          steps: [
            { t: 'Localizar **Gatekeeper**.', note: 'En el manual la opción aparece como “Gatekeeper - Integration… Sales Quotes”.' },
            { t: 'Acceder a **Integration… Sales Quotes**.' },
            { t: 'Localizar el campo **CRM Quote ID**.' },
            { t: 'Escribir el número de la cotización.', v: [example('Formato de ejemplo', 'COT-14475-7Q0W9')] },
            { t: 'Identificar el registro y seleccionar su casilla.' },
            { t: 'Abrir **Acciones**.' },
            { t: 'Seleccionar **Convert to SO**.', warn: 'Verifica que la cotización seleccionada sea la correcta antes de convertirla.' }
          ]
        },
        {
          title: 'Obtener el EPC y notificar',
          steps: [
            { t: 'Desplazarse hasta el campo **Sales Agreement Number**.' },
            { t: 'Copiar el código con formato EPC que aparece en ese campo.', v: [example('Formato de ejemplo · no es un número real', 'EPC000000')] },
            {
              t: 'Enviar por correo al solicitante el número ID de la cotización y el EPC.',
              table: { caption: 'Ejemplo de formato (valores de ejemplo)', head: ['COT', 'EPC'], rows: [['COT-14475-7Q0W9', 'EPC000000']] }
            }
          ]
        }
      ],
      verification: [
        'La cotización convertida es la correcta.',
        'Se ejecutó “Convert to SO”.',
        'Se copió el “Sales Agreement Number” (EPC).',
        'Se envió al solicitante el ID de la cotización y el EPC.'
      ],
      faq: [
        { q: '¿Qué hago si Extend no abre?', a: 'Ábrelo en una pestaña privada o ventana de incógnito; el manual indica que de otra forma no abre.' },
        { q: '¿Qué le envío al solicitante?', a: 'El número ID de la cotización (COT) y el número EPC obtenido.' }
      ],
      source: [
        'Abrir pestaña privada, ya que de otra forma no abre.',
        'Extend: ' + U.extend + ' — Azure AD > Inicio de sesión (cuenta de ' + E.ajimenez + ') > Gatekeeper - Integration… Sales Quotes > En CRM Quote ID poner el número de cotización > Seleccionar casilla > Acciones > Convert to SO > Desplazarse hasta “Sales Agreement Number” y copiar lo que tenga un formato como el siguiente: “EPC000000”.',
        'Mandar al solicitante por correo el número ID de cotización y el EPC. Ejemplo: COT-14475-7Q0W9 | EPC000000.'
      ]
    },

    {
      id: 'actualizar-crm',
      title: 'Actualizar información en CRM',
      shortTitle: 'Actualización de CRM',
      category: 'operaciones',
      icon: 'database',
      systems: ['CRM'],
      objective: 'Llegar al catálogo de familias y productos (Families & Products) desde la configuración avanzada del CRM.',
      summary: 'Ruta a Product Catalog > Families & Products.',
      keywords: ['CRM', 'Settings', 'engrane', 'Advanced Settings', 'Business', 'Product Catalog', 'Families & Products', 'familias', 'productos', 'catálogo'],
      requirements: [
        'Cuenta corporativa autorizada para el CRM.',
        'Familia o producto que se requiere actualizar.'
      ],
      notices: [
        { type: 'pending', text: 'El manual no indica qué campos deben actualizarse, cómo guardar el cambio ni cómo validar la edición. Este procedimiento llega hasta “Families & Products”.' }
      ],
      resources: [],
      phases: [
        {
          title: 'Acceso al CRM',
          steps: [
            { t: 'Abrir el navegador web.' },
            { t: 'Ingresar al CRM:', v: [url('CRM', U.crm)] },
            { t: 'Iniciar sesión con una cuenta corporativa autorizada.', note: NO_PASSWORD }
          ]
        },
        {
          title: 'Catálogo de productos',
          steps: [
            { t: 'Seleccionar el icono de engrane (**Settings**).' },
            { t: 'Seleccionar **Advanced Settings**.' },
            { t: 'En el lado derecho, abrir el menú desplegable de **Settings**.' },
            { t: 'Seleccionar **Business**.' },
            { t: 'Seleccionar **Product Catalog**.' },
            { t: 'Abrir **Families & Products**.' },
            { t: 'Localizar la familia o el producto requerido.', pend: 'Campos a actualizar, forma de guardar y validación de la edición: información pendiente de confirmar.' }
          ]
        }
      ],
      verification: [
        'Se accedió a “Families & Products”.',
        'Se localizó la familia o el producto requerido.'
      ],
      faq: [],
      source: [
        'CRM > Settings (Engrane) > Advanced Settings > Menú desplegable del lado derecho de Settings > Business > Product Catalog > Families & Products.'
      ]
    },

    {
      id: 'cambiar-precios',
      title: 'Cambiar precios',
      shortTitle: 'Cambio de precios',
      category: 'operaciones',
      icon: 'tag',
      systems: ['Extend'],
      objective: 'Acceder a la lista de precios de un modelo en Extend para realizar modificaciones autorizadas.',
      summary: 'Patrón Modelo > Lista de precios modelo > Nuevo > USD > Modificar.',
      keywords: ['precio', 'precios', 'lista de precios', 'Patrón Modelo', 'modelo', 'USD', 'Modificar', 'Extend', 'Acciones', 'Nuevo', 'Azure AD'],
      requirements: [
        'Cuenta corporativa autorizada para Extend (Azure AD).',
        'Modelo cuyo precio se va a cambiar.',
        'Navegador con pestaña privada o ventana de incógnito.'
      ],
      notices: [
        { type: 'pending', text: 'El manual no especifica en qué campo se captura el precio nuevo, qué autorización se requiere, cómo se confirma la operación ni cómo se comprueba que el precio se guardó.' }
      ],
      resources: [],
      phases: [
        {
          title: 'Acceso a Extend',
          steps: [
            { t: 'Abrir una pestaña privada o ventana de incógnito en el navegador.', note: EXTEND_PRIVATE },
            { t: 'Ingresar a Extend:', v: [url('Extend', U.extend)] },
            { t: 'Seleccionar **Azure AD**.' },
            { t: 'Iniciar sesión con la cuenta corporativa autorizada. Cuenta indicada en el manual:', v: [account('Cuenta de inicio de sesión', E.ajimenez)], note: NO_PASSWORD }
          ]
        },
        {
          title: 'Lista de precios del modelo',
          steps: [
            { t: 'Abrir **Patrón Modelo**.' },
            { t: 'Filtrar según el modelo buscado.' },
            { t: 'Seleccionar el modelo.' },
            { t: 'Abrir **Acciones**.' },
            { t: 'Seleccionar **Lista de precios modelo**.', pend: 'En el manual la secuencia aparece como “Acciones > Seleccionar > Lista de precios modelo”. Confirmar si existe una opción intermedia “Seleccionar”.' },
            { t: 'Seleccionar **Nuevo**.' },
            { t: 'Seleccionar la moneda **USD**.' },
            { t: 'Abrir **Modificar**.', pend: 'Campo del precio nuevo, autorización requerida, confirmación y comprobación del guardado: información pendiente de confirmar.' }
          ]
        }
      ],
      verification: [
        'Se accedió al modelo correcto en “Patrón Modelo”.',
        'Se abrió “Lista de precios modelo” > “Nuevo” > “USD” > “Modificar”.'
      ],
      faq: [
        { q: '¿Qué hago si Extend no abre?', a: 'Ábrelo en una pestaña privada o ventana de incógnito; el manual indica que de otra forma no abre.' }
      ],
      source: [
        'Extend > Patrón Modelo > Filtrar según lo buscado > Seleccionar > Acciones > Seleccionar > Lista de precios modelo > Nuevo > USD > Modificar.'
      ]
    },

    {
      id: 'facturas',
      title: 'Facturas y registro de gastos',
      shortTitle: 'Facturación y gastos',
      category: 'administracion',
      icon: 'receipt',
      systems: ['Extend', 'Excel', 'Correo', 'SharePoint'],
      objective: 'Enviar los comprobantes, registrar el gasto en Excel, capturar la transacción CFG en Extend con su prorrateo, validar, notificar el cargo y archivar el PDF y el XML.',
      summary: 'Envío de PDF/XML, Gastos MKT, transacción CFG con prorrateo, notificación y archivo.',
      keywords: ['factura', 'facturas', 'gastos', 'gasto', 'CFG', '1017', 'American Express', 'folio fiscal', 'prorrateo', 'dimensión', '010 | 11 | VAR | OTH', '010 | 31 | VAR | OTH', 'Transaction Line', 'número de lote', 'lote', 'MAEQ', 'GAGA', 'XML', 'PDF', 'resguardo digital', 'Líneas Simple OCC', 'publicidad', 'cuenta contable', 'Diferencias redondeo', 'Gastos MKT', 'pestaña Prorrateo', 'sin IVA', 'IVA', 'Partner proveedor', 'Transacciones', 'Extend'],
      requirements: [
        'PDF de la factura.',
        'XML de la factura.',
        'Acceso a Gastos MKT.xlsx.',
        'Cuenta corporativa autorizada para Extend.'
      ],
      notices: [
        { type: 'warn', text: 'El código `1017` corresponde a American Express en el caso documentado. No lo uses para otros proveedores.' },
        { type: 'warn', text: 'Si “Diferencias redondeo” no muestra 0, revisa la información y los montos antes de guardar. No hagas ajustes contables no documentados.' },
        { type: 'pending', text: 'Confirmar la relación exacta entre el campo “Regularizar diferencias de cambio” y el tipo de impuesto de la factura.' }
      ],
      resources: ['gastos-mkt', 'carpeta-gastos', 'carpeta-facturas', 'portales-mkt'],
      phases: [
        {
          title: 'Envío inicial de comprobantes',
          short: 'Envío inicial',
          steps: [
            { t: 'Preparar el PDF y el XML de la factura e identificar el gasto que se va a procesar.' },
            { t: 'Abrir el correo electrónico corporativo y crear un correo nuevo.' },
            { t: 'Adjuntar los dos documentos: PDF y XML.' },
            {
              t: 'Enviar ambos archivos a estos dos destinatarios:',
              v: [email('Recepción proveedores', E.proveedores), email('Recepción administrativa', E.adm)],
              compose: { to: [E.proveedores, E.adm], label: 'Redactar correo a ambos' },
              copyAll: { label: 'Copiar ambos correos', value: E.proveedores + '; ' + E.adm }
            },
            { t: 'No es necesario poner asunto en el correo.' },
            { t: 'Esperar a que la factura se refleje en el sistema.', note: 'El manual no indica un tiempo de espera específico.' }
          ]
        },
        {
          title: 'Registro en Excel',
          steps: [
            { t: 'Abrir en el Explorador de archivos la carpeta “Gastos”:', v: [path('Ruta de la carpeta', P.gastos)] },
            { t: 'Abrir el archivo **Gastos MKT.xlsx**:', v: [url('Gastos MKT.xlsx', U.gastos)] },
            { t: 'Registrar y llenar los datos de la factura.' },
            { t: 'Usar los mismos rubros para **proveedor**, **forma de pago**, **cuenta contable** y **rubro**, para poder filtrar de mejor forma.' },
            { t: 'Identificar el **concepto** registrado en el Excel: se vuelve a usar como número de lote, referencia, en el correo de notificación y como nombre de los archivos.' },
            { t: 'En Gastos MKT.xlsx, abrir la pestaña **Prorrateo**.' },
            { t: 'Capturar el gasto sin IVA. El prorrateo se calcula automáticamente en esa pestaña.', note: 'Los montos del prorrateo se capturan después en el campo “Importe” de Extend (fase 6).' }
          ]
        },
        {
          title: 'Acceso a Extend',
          steps: [
            { t: 'Abrir una pestaña privada o ventana de incógnito en el navegador.', note: EXTEND_PRIVATE },
            { t: 'Ingresar a Extend:', v: [url('Extend', U.extend)] },
            { t: 'Seleccionar **Azure AD**.' },
            { t: 'Iniciar sesión con la cuenta corporativa autorizada. Cuenta indicada en el manual:', v: [account('Cuenta de inicio de sesión', E.ajimenez)], note: NO_PASSWORD },
            { t: 'Esperar a que cargue la interfaz de Extend.' }
          ]
        },
        {
          title: 'Creación de la transacción',
          short: 'Crear transacción',
          steps: [
            { t: 'Abrir **Transacciones**.' },
            { t: 'En la barra de herramientas, arriba a la izquierda, seleccionar **Carpeta de nueva vista**.' },
            { t: 'En **Número de lote**, escribir el mismo concepto que se registró en el Excel.' },
            { t: 'Seleccionar el icono de hoja con un **+** (**Nuevo**).' },
            { t: 'En **Tipo de transacción**, escribir:', v: [code('Tipo de transacción', 'CFG', 'Copiar CFG')] },
            { t: 'Seleccionar la casilla.' },
            { t: 'Presionar la flecha.' }
          ]
        },
        {
          title: 'Configuración de factura y proveedor',
          short: 'Configuración',
          steps: [
            { t: 'Cambiar **Nivel de cálculo de impuestos** a **Transaction Line**.', v: [code('Valor del campo', 'Transaction Line')] },
            { t: 'En **Partner proveedor**, presionar la lupa.' },
            { t: 'En **Cód. Viejo de Partner**, escribir el código:', v: [code('Código de partner', '1017', 'Copiar 1017')] },
            { t: 'Verificar que el código corresponda a **American Express** y presionar **Aceptar**.', warn: 'El código 1017 corresponde a American Express en el caso documentado; no lo uses para otros proveedores.' },
            { t: 'En **Número de factura de proveedor**, presionar la lupa.' },
            { t: 'Escribir el folio fiscal de la factura.' },
            { t: 'Seleccionar el documento si aparece. Si no aparece, reintentar más tarde.', warn: 'Nunca selecciones otro folio por conveniencia.', note: 'La factura debe reflejarse primero en el sistema después del envío del PDF y XML (fase 1).' },
            { t: 'En **Referencia**, escribir nuevamente el concepto del Excel.' },
            { t: 'Abrir **Líneas Simple OCC**.' },
            { t: 'Seleccionar la **Cuenta contable**.', note: 'Según el manual, usualmente es publicidad. Confirma la cuenta en cada caso.' }
          ]
        },
        {
          title: 'Captura del prorrateo',
          short: 'Prorrateo',
          steps: [
            { t: 'En **Dimensión**, capturar la primera dimensión del prorrateo:', v: [code('Dimensión 1', '010 | 11 | VAR | OTH', 'Copiar dimensión 1')] },
            { t: 'En **Regularizar diferencias de cambio**, poner el tipo de impuesto aplicado en la factura.', pend: 'Confirmar la relación exacta entre este campo y el tipo de impuesto. Se conserva tal como lo indica el manual.' },
            { t: 'En **Importe**, poner el primer monto que aparece al prorratear en la pestaña **Prorrateo** de Gastos MKT.xlsx.' },
            { t: 'Verificar que el impuesto se haya llenado solo.' },
            { t: 'Duplicar la hoja (línea).' },
            { t: 'Comprobar que arriba, en **Documento/Línea**, aparezca CFG, un código y después **2**.' },
            { t: 'En la segunda línea, cambiar únicamente la **Dimensión** a:', v: [code('Dimensión 2', '010 | 31 | VAR | OTH', 'Copiar dimensión 2')] },
            { t: 'En **Importe**, poner el segundo monto del prorrateo (pestaña **Prorrateo** de Gastos MKT.xlsx).' },
            { t: 'Comprobar que **Diferencias redondeo** muestre `0`.', warn: 'Si no es 0, revisa la información y los montos antes de guardar. No hagas ajustes contables para forzar el cuadre.' }
          ]
        },
        {
          title: 'Validación y número de lote',
          short: 'Validación',
          steps: [
            { t: 'Presionar **Guardar y salir** en la captura de líneas.' },
            { t: 'Verificar que el importe sea el mismo que el de la factura.' },
            { t: 'Verificar que el impuesto esté bien puesto.' },
            { t: 'Confirmar el prorrateo y que **Diferencias redondeo** sea `0`.' },
            { t: 'Presionar **Guardar y salir** en el registro principal.' },
            { t: 'Copiar el **número de lote**.' },
            { t: 'Pegar el número de lote en **Gastos MKT.xlsx**, en el apartado correspondiente:', v: [url('Gastos MKT.xlsx', U.gastos)] }
          ]
        },
        {
          title: 'Notificación del cargo',
          short: 'Notificación',
          steps: [
            { t: 'Identificar si el cargo es de **MAEQ** o de **GAGA**.' },
            { t: 'Para cargos de MAEQ, el destinatario es:', v: [email('Cargos MAEQ', E.maeq)] },
            { t: 'Para cargos de GAGA, el destinatario es:', v: [email('Cargos GAGA', E.gaga)] },
            { t: 'Enviar el correo al destinatario correcto con el concepto del Excel y el número de lote, adjuntando el PDF y el XML de la factura.' }
          ]
        },
        {
          title: 'Archivo de comprobantes',
          short: 'Archivo',
          steps: [
            { t: 'Abrir la carpeta de facturas mensuales:', v: [path('Ruta de la carpeta', P.facturas), url('Carpeta “Mensual” en SharePoint', U.facturas)] },
            { t: 'Abrir la carpeta del mes correspondiente.' },
            { t: 'Guardar ahí ambos archivos: PDF y XML.' },
            { t: 'Nombrar los archivos igual que el concepto del Excel.' }
          ]
        }
      ],
      verification: [
        'PDF y XML enviados a los dos correos de recepción.',
        'Gasto registrado en Gastos MKT.xlsx.',
        'Gasto sin IVA capturado en la pestaña “Prorrateo” de Gastos MKT.xlsx.',
        'Proveedor, rubro, forma de pago y cuenta contable consistentes.',
        'Extend abierto y transacción CFG creada.',
        'Proveedor seleccionado y validado.',
        'Folio fiscal correcto.',
        '“Transaction Line” seleccionado.',
        'Prorrateo con dimensiones y montos correctos.',
        'Diferencias redondeo = 0.',
        'Importe de la transacción igual al de la factura.',
        'Impuestos verificados.',
        'Número de lote copiado al Excel.',
        'Notificación enviada a MAEQ o GAGA, según corresponda.',
        'PDF y XML guardados en la carpeta del mes, con el nombre del concepto.'
      ],
      faq: [
        { q: '¿Dónde está Gastos MKT?', a: 'En la carpeta “Gastos” (' + P.gastos + ') y en SharePoint.', v: [path('Carpeta “Gastos”', P.gastos), url('Gastos MKT.xlsx', U.gastos)] },
        { q: '¿Dónde se calcula el prorrateo?', a: 'En la pestaña “Prorrateo” de Gastos MKT.xlsx. Ahí se captura el gasto sin IVA y el prorrateo se calcula automáticamente.', v: [url('Gastos MKT.xlsx', U.gastos)] },
        { q: '¿Qué hago si la factura no aparece al buscar el folio?', a: 'Reintenta más tarde. Primero debe reflejarse en el sistema después de enviar el PDF y el XML a los dos correos de recepción.' },
        { q: '¿Qué hago si Extend no abre?', a: 'Ábrelo en una pestaña privada o ventana de incógnito; el manual indica que de otra forma no abre.' },
        { q: '¿Dónde está la información para la facturación?', a: 'En Portales MKT.xlsx, pestaña “Archivos”.', v: [url('Portales MKT.xlsx', U.portales)] }
      ],
      source: [
        'Primero se envía tanto el PDF como el XML a "' + E.proveedores + '" y "' + E.adm + '". No es necesario poner asunto en el correo. Esperar un tiempo a que se refleje en el sistema.',
        'En “' + P.gastos + '” se encuentra el archivo “Gastos MKT.xlsx”. Registrar y llenar datos > Usar mismos rubros para proveedor, forma de pago, cuenta contable y rubro para poder filtrar de mejor forma.',
        'Extend > Transacciones > Carpeta de nueva vista (arriba a la izquierda, barra de herramientas), poner en el número de lote el mismo concepto que se puso en el Excel. Hoja con un + (Nuevo) > Poner en tipo de transacción “CFG” > Seleccionar casilla > Presionar flecha.',
        'Cambiar “Nivel de cálculo de impuestos:” a “Transaction Line” > Partner proveedor: picar la lupa, escribir en “Cód. Viejo de Partner” el código “1017” y verificar que corresponda a “American Express” > Aceptar > “Número de factura de proveedor:” picar la lupa > poner el folio fiscal > Si no aparece, reintenta después > Referencia: Poner nuevamente el concepto del Excel > Líneas Simple OCC > Cuenta contable (usualmente es publicidad) > “Dimensión” se llena según el prorrateo: 010 | 11 | VAR | OTH > Regularizar diferencias de cambio: Se pone el tipo de impuesto aplicado en la factura > Importe: Poner el primer monto que aparece al prorratear (impuesto se llena solo) > Duplicar hoja; arriba en “Documento/Línea” dirá CFG un código y después 2. > Lo que cambia es únicamente “Dimensión”; ahora será 010 | 31 | VAR | OTH. > En importe, poner el segundo monto del prorrateo. > De realizar bien el proceso, en “Diferencias redondeo:” debe aparecer en 0. > Guardar y salir. > Verificar que el importe sea el mismo que en la factura y que el impuesto esté bien puesto. > Guardar y salir. > Copiar número de lote y pegar en Excel en el apartado correspondiente.',
        'Para cargos de MAEQ, enviar correo a "' + E.maeq + '"; en caso de cargos de GAGA, enviar correo a "' + E.gaga + '", con el concepto del excel, número de lote y adjuntar PDF de la factura y el XML.',
        'Guardar ambos archivos (PDF & XML) en carpeta ordenada por mes en “' + P.facturas + '” > Colocar en mes correspondiente > Nombrar igual que el concepto del excel.'
      ]
    },

    {
      id: 'vpn',
      title: 'Conexión VPN',
      shortTitle: 'VPN',
      category: 'sistemas',
      icon: 'shield',
      systems: ['Cisco Secure Client'],
      objective: 'Establecer la conexión VPN corporativa con Cisco Secure Client.',
      summary: 'Cisco Secure Client hacia 201.132.22.10.',
      keywords: ['VPN', 'Cisco', 'Cisco Secure Client', 'Secure Client', VPN_IP, 'IP', 'conexión', 'Connect', 'red'],
      requirements: [
        'Equipo con Windows y Cisco Secure Client instalado.',
        'Credenciales corporativas autorizadas.'
      ],
      notices: [],
      resources: [],
      phases: [
        {
          title: 'Conexión',
          steps: [
            { t: 'Abrir el menú **Inicio** de Windows.' },
            { t: 'Buscar y abrir **Cisco Secure Client**.' },
            { t: 'Verificar que la dirección de conexión sea:', v: [ip('Dirección VPN', VPN_IP)] },
            { t: 'Presionar **Connect**.' },
            { t: 'Iniciar sesión con tus credenciales corporativas autorizadas cuando se soliciten.', note: NO_PASSWORD },
            { t: 'Verificar que Cisco Secure Client muestre la conexión como activa.' }
          ]
        }
      ],
      verification: ['Cisco Secure Client muestra la VPN conectada a 201.132.22.10.'],
      faq: [],
      source: ['Cisco Secure Client > Verificar que sea 201.132.22.10 > Connect > Iniciar Sesión.']
    },

    {
      id: 'videos-capacitacion',
      title: 'Videos de capacitación',
      category: 'recursos',
      icon: 'video',
      systems: ['SharePoint'],
      objective: 'Consultar los videos explicativos del área de marketing.',
      summary: 'Videos explicativos del área en SharePoint.',
      keywords: ['video', 'videos', 'capacitación', 'marketing', 'explicativo', 'inducción'],
      requirements: ['Cuenta corporativa con acceso a SharePoint de Construmac.'],
      notices: [
        { type: 'info', text: 'Los videos se abren en su ubicación original de SharePoint; no se reproducen dentro de este manual.' }
      ],
      resources: ['video-marketing'],
      phases: [
        {
          title: 'Consultar videos',
          component: 'videos',
          steps: [
            { t: 'Elegir el video en la lista y presionar **Abrir en SharePoint**.', component: 'videos' },
            { t: 'Iniciar sesión con tu cuenta corporativa si SharePoint lo solicita.', note: NO_PASSWORD }
          ]
        }
      ],
      verification: ['Se abrió el video en SharePoint.'],
      faq: [],
      source: ['Algunos videos explicativos: “Cómo funciona el área de marketing de Construmac”.']
    }
  ];

  var ORDER = [
    'reporte-diario-cotizaciones', 'cierre-semanal-cotizaciones', 'market-share', 'junta-trimestral',
    'acuerdos-de-venta', 'actualizar-crm', 'cambiar-precios',
    'facturas',
    'vpn',
    'archivos-esenciales', 'videos-capacitacion'
  ];

  var QUICK = ['reporte-diario-cotizaciones', 'acuerdos-de-venta', 'facturas', 'market-share', 'junta-trimestral', 'actualizar-crm', 'cambiar-precios', 'vpn'];
  var SECONDARY = ['archivos-esenciales', 'videos-capacitacion'];

  var MENU = [
    {
      id: 'inicio', title: 'Inicio', items: [
        { label: 'Panel principal', href: '#/', icon: 'home', match: 'home' },
        { label: 'Todos los procedimientos', href: '#/procedimientos', icon: 'list', match: 'list' },
        { label: 'Favoritos', href: '#/favoritos', icon: 'star', match: 'favorites' },
        { label: 'Accesos y herramientas', href: '#/herramientas', icon: 'key', match: 'tools' }
      ]
    },
    {
      id: 'reportes', title: 'Reportes y análisis', items: [
        { proc: 'reporte-diario-cotizaciones' },
        { proc: 'cierre-semanal-cotizaciones' },
        { proc: 'market-share' },
        { proc: 'junta-trimestral' }
      ]
    },
    {
      id: 'operaciones', title: 'Operaciones comerciales', items: [
        { proc: 'acuerdos-de-venta' },
        { proc: 'actualizar-crm' },
        { proc: 'cambiar-precios' }
      ]
    },
    {
      id: 'administracion', title: 'Administración', items: [
        { proc: 'facturas' }
      ]
    },
    {
      id: 'sistemas', title: 'Sistemas', items: [
        { label: 'Acceso a Extend', href: '#/sistemas/extend', icon: 'server', match: 'system:extend' },
        { label: 'Acceso a CRM', href: '#/sistemas/crm', icon: 'database', match: 'system:crm' },
        { proc: 'vpn', label: 'Conexión VPN' }
      ]
    },
    {
      id: 'recursos', title: 'Recursos', items: [
        { proc: 'archivos-esenciales' },
        { label: 'Directorio de enlaces', href: '#/directorio', icon: 'link', match: 'directory' },
        { label: 'Distribución de zonas', href: '#/zonas', icon: 'pin', match: 'zones' },
        { proc: 'videos-capacitacion' }
      ]
    }
  ];

  var SUGGESTED = ['Factura', 'EPC', 'Tipo de cambio', 'CFG', '1017', 'Panjiva', 'VPN', 'Q4', 'Guadalajara', 'Presentaciones'];

  window.CM_DATA = {
    procedures: PROCEDURES,
    order: ORDER,
    quick: QUICK,
    secondary: SECONDARY,
    menu: MENU,
    categories: CATEGORIES,
    resources: RESOURCES,
    contacts: CONTACTS,
    systems: SYSTEMS,
    zones: ZONES,
    suggested: SUGGESTED,
    paths: P,
    urls: U
  };
})();
