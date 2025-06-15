/
├── app/                       # Rutas y vistas públicas del sitio
│   ├── layout.tsx            # Layout general
│   ├── page.tsx              # Página raíz (landing o login)
│   └── usuarios/             # Página de gestión de usuarios
│       ├── page.tsx
│       └── components/
│           └── UsuarioTable.tsx
│
├── components/               # Componentes compartidos (botones, inputs, layout)
│   └── ui/                   # Componentes de interfaz reutilizables (daisyUI personalizados)
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
│
├── domain/                   # MODELO DE DOMINIO (clases orientadas a objetos)
│   ├── entidades/            # Clases del negocio (Usuario, Estudiante, Materia...)
│   │   └── Usuario.ts
│   ├── repositorios/         # Interfaces (contratos) para acceso a datos
│   │   └── UsuarioRepository.ts
│   ├── servicios/            # Lógica de dominio (por ejemplo: ValidarUsuario)
│   │   └── ServicioAutenticacion.ts
│   └── value-objects/        # Objetos inmutables y conceptos del dominio
│       └── Email.ts
│
├── application/              # CASOS DE USO (interactúan con dominio)
│   ├── servicios/            # Casos de uso como GestionarUsuario, GenerarReporte, etc.
│   │   └── GestionarUsuarioService.ts
│   └── dtos/                 # Objetos de transferencia
│       └── UsuarioDTO.ts
│
├── infrastructure/           # Implementaciones técnicas (DB, notificaciones, correo)
│   ├── orm/                  # Prisma y adaptadores de repositorios
│   │   ├── prismaClient.ts
│   │   ├── UsuarioRepositoryPrisma.ts
│   │   └── mappings/
│   │       └── UsuarioMap.ts
│   ├── correo/               # Envío de correos reales (Mailgun, SMTP, etc.)
│   │   └── NotificadorCorreo.ts
│   ├── autenticacion/        # Lógica de login, JWT, sesiones
│   │   └── Autenticador.ts
│   └── servicios-externos/   # Conexiones con APIs externas (banco, SEP...)
│
├── lib/                      # Utilidades generales
│   ├── validacion/           # Validadores personalizados
│   └── helpers/              # Funciones auxiliares
│
├── prisma/                   # Esquema y migraciones de Prisma
│   └── schema.prisma
│
├── public/                   # Archivos estáticos (imágenes, favicon, etc.)
├── styles/                   # Tailwind config + global styles
│   ├── globals.css
│   └── theme.css
├── .env                      # Variables de entorno
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
