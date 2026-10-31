# NOMADA GROUP · Agentes Independientes Internacional
> **Ubicación Territorial:** La Convención, Cusco, Perú  
> **Curador Director:** Mariano Otazu Marín · [+51 950 155 945](tel:+51950155945) · [WhatsApp Directo](https://wa.me/51950155945?text=Hola%20Mariano%20Otazu,%20estoy%20interesado%20en%20las%20propiedades%20de%20NOMADA%20GROUP%20en%20La%20Convenci%C3%B3n,%20Cusco.)

---

## 🏔️ Acerca del Proyecto

**NOMADA GROUP** es una plataforma inmobiliaria y curaduría arquitectónica internacional concebida para la provincia de **La Convención, Cusco, Perú**.

Lejos de las inmobiliarias tradicionales con cuadrículas mecánicas y filtros impersonales, NOMADA GROUP sitúa a los **agentes internacionales como protagonistas**: cada uno abre su propio universo de fincas de café de especialidad, santuarios de montaña y residencias bioclimáticas en la ceja de selva cusqueña (Quillabamba, Cañón del Urubamba, Santa Teresa y Vilcabamba).

---

## 🌿 Características Principales

- **Curaduría Liderada por Mariano Otazu Marín**:
  - Contacto telefónico y WhatsApp directo: **`+51 950 155 945`**.
  - Especializado en arquitectura bioclimática, fincas cafetaleras de altura y residencias de piedra andina en La Convención.
- **Modo Inmersivo (Cinematográfico)**:
  - Botón dedicado en el header que oculta la UI secundaria (pie de página, navegación adicional).
  - Activa una cápsula flotante con salida rápida mediante la tecla `ESC`.
  - Cursor personalizado expandido con física amortiguada (`useSpring`) y halo respirable.
- **Gestor de Audio Ligero (Web Audio API)**:
  - Generación procedural sin archivos de audio externos (0 kB de descarga sonora).
  - Textura orgánica de viento andino y resonancia telúrica de 55 Hz / 110 Hz.
  - Modulación dinámica ligada a la velocidad de desplazamiento del scroll (**Lenis**).
  - Transiciones graduales de entrada (fade-in) y salida (fade-out) suaves.
- **Fotografías Reales del Territorio**:
  - Panorámicas del Cañón del Río Urubamba y los meandros subtropicales.
  - Villa Quillabamba sobre plantaciones de café Geisha.
  - Santuario contemporáneo de Vilcabamba entre orquídeas y niebla.
  - Vistas aéreas de terrazas agrícolas andinas y vegetación virgen.
- **Base de Datos Supabase (Relacional)**:
  - Tablas: `agents`, `properties`, `property_images`, `viewing_inquiries`.
  - Explorador en vivo en la interfaz para inspeccionar el esquema DDL y los registros relacionales.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite 8
- **Estilos**: Tailwind CSS v4 (`@tailwindcss/vite`) + Google Fonts (Fraunces & DM Sans)
- **Animaciones**: Motion (`motion/react`) con `layoutId`, `AnimatePresence`, `useScroll`, `useTransform` y `useSpring`
- **Scroll**: Lenis Smooth Inertial Scrolling
- **Sonido**: Web Audio API nativo con filtros biquad y generador de ruido Brown/Pink
- **Iconografía**: Lucide React

---

## 🚀 Despliegue en GitHub Pages

Este repositorio está preconfigurado para compilarse y publicarse automáticamente en **GitHub Pages** a través de **GitHub Actions**.

### Pasos para Activar en tu Repositorio de GitHub:

1. **Sube el código a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: NOMADA GROUP La Convención Cusco Perú"
   git branch -M main
   git remote add origin https://github.com/hackenmate/nomada.git
   git push -u origin main
   ```

2. **Habilitar GitHub Pages**:
   - Ve a **Settings** de tu repositorio en GitHub: [https://github.com/hackenmate/nomada/settings/pages](https://github.com/hackenmate/nomada/settings/pages)
   - En **Build and deployment > Source**, selecciona **GitHub Actions**.
   - ¡Listo! El flujo de trabajo en `.github/workflows/deploy.yml` compilará la aplicación y la publicará automáticamente en:
     👉 **https://hackenmate.github.io/nomada/**

---

## 💻 Desarrollo Local

Para ejecutar el proyecto en tu máquina local:

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git
cd TU-REPOSITORIO

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo en http://localhost:3000
npm run dev

# 4. Compilar para producción
npm run build

# 5. Previsualizar la compilación
npm run preview
```

---

## 🏛️ Contacto Directo

- **Agente Principal:** Mariano Otazu Marín
- **Teléfono / WhatsApp:** [+51 950 155 945](https://wa.me/51950155945)
- **Territorio:** Quillabamba · Cañón del Urubamba · Vilcabamba · La Convención, Cusco, Perú
- **Red:** Cusco · Lima · Madrid · París

---

© 2026 NOMADA GROUP International S.A. Todos los derechos reservados.
