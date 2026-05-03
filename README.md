# Obraction — Frontend

Interfaz web para la gestión integral de obras y proyectos de construcción. Frontend de la aplicación SaaS **Obraction**, desarrollada como proyecto final de ciclo de Desarrollo de Aplicaciones Web.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| **React** | Librería de interfaz de usuario |
| **Vite** | Bundler y servidor de desarrollo |
| **SCSS** | Estilos |
| **React Router** | Enrutamiento del lado del cliente |

---

## Requisitos previos

- Node.js 18 o superior
- npm
- Backend de Obraction en marcha

---

## Instalación y puesta en marcha en local

### 1. Clonar el repositorio

```bash
git clone https://github.com/angeland-ou/obraction.git
cd obraction
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y rellena los valores:

```bash
cp .env.example .env.local
```

Variables necesarias:

```bash
VITE_API_URL=http://localhost:3000
```

### 4. Arrancar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

> El backend debe estar corriendo en `http://localhost:3000` para que la aplicación funcione correctamente.

---

## Scripts disponibles

```bash
npm run dev      # Arranca el servidor de desarrollo
npm run build    # Genera el build de producción
npm run preview  # Previsualiza el build de producción
```

---

## Estructura del proyecto

```
src/
├── assets/          # Imágenes, iconos y recursos estáticos
├── components/      # Componentes reutilizables
├── pages/           # Páginas de la aplicación
├── styles/          # Estilos globales SCSS
├── App.jsx          # Componente raíz y configuración de rutas
└── main.jsx         # Punto de entrada
```
## Estructura del proyecto

```
obraction-web/
├── index.html               # Punto de entrada HTML
├── vite.config.js           # Configuración de Vite
├── public/
│   ├── favicon.svg
│   └── icons.svg            # Sprite SVG con todos los iconos de la app
└── src/
    ├── App.jsx              # Componente raíz
    ├── main.jsx             # Punto de entrada de React
    ├── api/                 # Capa de comunicación con el backend
    │   ├── http.js          # Cliente HTTP base (fetch + interceptor de refresh token)
    │   ├── auth.js          # Llamadas a /api/auth
    │   ├── clients.js       # Llamadas a /api/clients
    │   ├── projects.js      # Llamadas a /api/projects
    │   ├── tasks.js         # Llamadas a /api/tasks
    │   ├── movements.js     # Llamadas a /api/movements
    │   ├── documents.js     # Llamadas a /api/documents
    │   └── tenant.js        # Llamadas a /api/tenant
    ├── components/          # Componentes reutilizables
    │   ├── Button.jsx
    │   ├── Card.jsx
    │   ├── Input.jsx
    │   ├── Modal.jsx
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   ├── Nav.jsx
    │   ├── BalanceCard.jsx  # Tarjeta de resumen financiero
    │   ├── ClientForm.jsx   # Formulario de creación/edición de cliente
    │   ├── MovementForm.jsx # Formulario de creación/edición de movimiento
    │   ├── TaskForm.jsx     # Formulario de creación/edición de tarea
    │   ├── DocumentItem.jsx # Elemento de lista de documentos
    │   └── ProtectedRoute.jsx # Redirige al login si no hay sesión activa
    ├── context/             # Estado global de la aplicación
    │   ├── AuthContext.jsx  # Contexto de autenticación
    │   ├── AuthProvider.jsx # Proveedor con lógica de sesión
    │   ├── TenantContext.jsx # Datos de la empresa activa
    │   └── ThemeContext.jsx  # Tema y color corporativo
    ├── hooks/
    │   └── useAuth.js       # Hook para acceder al contexto de autenticación
    ├── pages/               # Páginas de la aplicación
    │   ├── LandingPage.jsx  # Página de inicio pública
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Activation.jsx   # Activación de cuenta por token
    │   ├── Dashboard.jsx    # Panel principal con balance global
    │   ├── Clients.jsx      # Listado de clientes
    │   ├── AddClient.jsx
    │   ├── EditClient.jsx
    │   ├── ClientDetail.jsx
    │   ├── Projects.jsx     # Listado de proyectos
    │   ├── AddProject.jsx
    │   ├── EditProject.jsx
    │   ├── ProjectDetail.jsx
    │   ├── Movements.jsx    # Listado de movimientos económicos
    │   ├── AddMovement.jsx
    │   ├── EditMovement.jsx
    │   ├── MovementDetail.jsx
    │   ├── TenantDetail.jsx # Datos de la empresa
    │   ├── EditTenant.jsx
    │   └── NotFound.jsx     # Página 404
    ├── routes/
    │   └── AppRouter.jsx    # Definición de rutas públicas y protegidas
    ├── styles/              # Estilos SCSS organizados por módulos
    │   ├── main.scss        # Importa todos los parciales
    │   ├── _variables.scss  # Variables de color, tipografía y espaciado
    │   ├── _base.scss       # Reset y estilos base
    │   ├── _fonts.scss      # Declaración de fuentes
    │   ├── _animations.scss # Animaciones globales
    │   └── components/      # Estilos específicos por componente
    │       ├── _button.scss
    │       ├── _card.scss
    │       ├── _forms.scss
    │       ├── _input.scss
    │       ├── _modal.scss
    │       ├── _header.scss
    │       ├── _footer.scss
    │       ├── _nav.scss
    │       ├── _landing.scss
    │       ├── _client.scss
    │       ├── _projects.scss
    │       ├── _movements.scss
    │       └── _tenant.scss
    └── utils/
        └── normalize.js     # Normalización de datos de la API
```

---

## Despliegue en producción (Vercel)

### 1. Importar el repositorio en Vercel

Conecta el repositorio de GitHub en [vercel.com](https://vercel.com) y configura:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 2. Configurar variables de entorno en Vercel

En **Settings → Environment Variables** añade:

```bash
VITE_API_URL=https://api.obraction.com
```

### 3. Configurar dominio personalizado

En **Settings → Domains** añade `api.obraction.com`.

En Cloudflare añade el registro DNS:

```
api.obraction.com → CNAME → cname.vercel-dns.com
```

---

## Entornos

| Entorno | URL Frontend | API |
|---|---|---|
| Local | `http://localhost:5173` | `http://localhost:3000` |
| Producción | `https://obraction.com` | `https://api.obraction.com` |

---

## Autor

Ángela — Proyecto Final de Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web
