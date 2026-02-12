# ENRLV - Sistema de Gestión Documental

Sistema web integral para la generación automatizada de justificantes y oficios de la Escuela Normal Rural "Luis Villarreal" (El Mexe). Desarrollado con **React**, **Tailwind CSS** y **Firebase**.

## 🚀 Características Principales

### 🔐 Autenticación y Seguridad

- **Login Administrativo**: Acceso seguro mediante **Firebase Authentication**.
- **Roles de Usuario**: Panel exclusivo para personal de Coordinación Docente.
- **Protección de Rutas**: Sistema de enrutamiento protegido que impide accesos no autorizados.

### 📄 Módulos de Gestión

El sistema cuenta con 4 módulos principales para la generación de documentos PDF oficiales:

1.  **Justificante Individual**

    - Formulario dinámico con búsqueda de alumnos en tiempo real.
    - Validación de fechas (regla de los 3 días): Si se selecciona una fecha con más de 3 días de antigüedad, el sistema solicita una **Clave de Administrador** para autorizar la excepción.
    - Generación automática de folios consecutivos.

2.  **Justificante Grupal (Lista)**

    - Permite seleccionar múltiples alumnos y generar un único documento con una tabla de relación.
    - Ideal para justificar inasistencias por comisiones, deportes o actividades culturales.

3.  **Justificante Masivo**

    - Generación de oficios dirigidos a todo el cuerpo académico o grupos grandes.
    - Formato libre para el cuerpo del mensaje.

4.  **Oficio de Práctica**
    - Gestión de oficios de presentación para prácticas profesionales.
    - Vinculación automática entre Alumnos y Escuelas de Práctica.

### ⚙️ Panel de Configuración

- **Gestión de Alumnos**: Altas, bajas y modificaciones de la matrícula estudiantil directamente en **Firestore**.
- **Catálogo de Escuelas**: Administración de las escuelas primarias/secundarias disponibles para prácticas.
- **Interfaz Intuitiva**: Diseño limpio y rápido para actualizaciones masivas.

## 🛠️ Stack Tecnológico

- **Frontend**: React (Vite) + Tailwind CSS
- **Routing**: React Router DOM (SPA)
- **Base de Datos**: Google Firestore (NoSQL)
- **Autenticación**: Firebase Auth
- **Generación PDF**: jsPDF + autoTable
- **Despliegue**: Vercel

## 📂 Estructura de Datos (Firebase)

### Colección `students`

```json
{
  "matricula": "191299880001",
  "nombre": "ALAN MATEO SANCHEZ GUZMAN",
  "semestre": "DÉCIMO",
  "grupo": "A"
}
```

### Colección `schools`

```json
{
  "cct": "13DPR1234X",
  "nombre": "ESC. PRIM. VENUSTIANO CARRANZA",
  "director": "PROFR. JUAN PEREZ",
  "ubicacion": "ACTOPAN, HGO."
}
```

### Colección `folios`

Control de consecutivos para cada tipo de documento.

```json
{
  "individual": 105,
  "grupal": 42,
  "practica": 89
}
```

## 📦 Instalación y Despliegue

1.  **Clonar repositorio**

    ```bash
    git clone https://github.com/usuario/enrlv-app.git
    cd enrlv-app
    ```

2.  **Instalar dependencias**

    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno (.env)**

    ```env
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    ```

4.  **Correr en desarrollo**

    ```bash
    npm run dev
    ```

5.  **Build para producción**
    ```bash
    npm run build
    ```

## 📄 Licencia

Escuela Normal Rural "Luis Villarreal" - Coordinación Docente © 2026.
