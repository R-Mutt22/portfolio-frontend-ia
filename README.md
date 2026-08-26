# 🎨 Portafolio Frontend IA (Astro + React)

Interfaz de usuario ultrarrápida y optimizada para SEO de mi portafolio profesional. Este frontend integra un asistente virtual conversacional impulsado por Inteligencia Artificial, diseñado para que reclutadores y clientes interactúen dinámicamente con mi experiencia y proyectos.

## 🚀 Sobre el proyecto

La arquitectura frontend está construida priorizando el rendimiento web y la accesibilidad (A11y). Utilizando el patrón de "Islas Interactivas" de Astro, el contenido estático de mi currículum se renderiza instantáneamente, mientras que el widget de chat interactivo, desarrollado en React, maneja la comunicación asíncrona con mi API backend en Spring Boot. 

Mi enfoque como desarrollador integra mi sensibilidad por el diseño (UI/UX) con prácticas rigurosas de Testing funcional, garantizando que esta interfaz sea intuitiva, accesible y libre de bugs.

## 🛠️ Stack Tecnológico

* **Framework Principal:** Astro (Server-Side Generation para máximo SEO).
* **Interactividad (Islas):** React.js.
* **Estilos:** Tailwind CSS.
* **Conexión API:** Fetch API integrando con backend Java/Spring Boot (RAG).
* **Despliegue:** Preparado para Vercel (Edge Network).

## 💡 Características Clave

* **Carga Instantánea:** Cero JavaScript bloqueante en el renderizado inicial.
* **Asistente IA:** Componente de chat que consume una API REST para responder preguntas sobre mi experiencia técnica (ej. integraciones de e-commerce, desarrollo Web3, testing).
* **Accesibilidad:** Estructura semántica HTML5 orientada a superar auditorías de accesibilidad, aplicando conocimientos adquiridos en mis pruebas para plataformas a gran escala.

## ⚙️ Configuración y Uso Local

1. Clonar este repositorio:
  ```bash
   git clone [https://github.com/TU_USUARIO/portfolio-frontend-ia.git](https://github.com/TU_USUARIO/portfolio-frontend-ia.git)
  ```

2. Instalar las dependencias:
  ```bash
  pnpm install
  ```

3. Configurar la URL del backend. Crear un archivo .env en la raíz:
Fragmento de código
  ```bash
  PUBLIC_API_URL=http://localhost:8080/api/chat
  ```

4. Iniciar el servidor de desarrollo:
  ```bash
  pnpm run dev
  ```

5. Abrir http://localhost:4321 en el navegador.

🔗 Enlaces Relacionados
[Repositorio del Backend (Spring Boot + IA)](https://github.com/R-Mutt22/portfolio-backend-ia.git)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
