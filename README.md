# Proyecto Final DevOps 🚀

Este repositorio contiene el proyecto final de la asignatura **DevOps e Integración Continua** de la Universidad Autónoma de Yucatán. Se implementó una solución web con arquitectura distribuida, pipelines de integración y despliegue continuo, así como monitoreo en tiempo real mediante visualización de logs.

## 📋 Descripción General

La aplicación consiste en una SPA (Single Page Application) con autenticación, panel de métricas y operaciones CRUD para usuarios, vehículos, viajes y conductores. El backend está desacoplado y se ejecuta en un contenedor Docker, mientras que el frontend se despliega en una máquina virtual Linux mediante Jenkins.

## ✅ Funcionalidades Principales

- Inicio de sesión y registro de usuarios.
- Dashboard con métricas clave:
  - Usuarios registrados
  - Viajes del día
  - Vehículos creados
  - Conductores activos
- Operaciones CRUD completas por entidad.
- Validaciones visuales mediante notificaciones tipo toast.
- Logs centralizados enviados a Elasticsearch y visualizados en Grafana.

## 🛠 Instalación y Ejecución en Local

### Backend

```bash
cd backend
npm install
```

Asegúrate de crear y configurar correctamente el archivo `.env` con las variables necesarias (puerto, base de datos, JWT, etc.). Luego, ejecuta:

```bash
npm run start
```

### Frontend

```bash
cd frontend
npm install
```

También es necesario tener un archivo `.env` en esta carpeta, configurado con la URL del backend y otras variables que la aplicación requiera. Una vez configurado, ejecuta:

```bash
npm run dev
```

Esto levantará el frontend en modo desarrollo.

## 👥 Integrantes del equipo

- Fernando Joachín Prieto
- José Carlos Leo Fernández
- Carlos Augusto May Vivas
- Andrea Margarita Mendoza Tec
- Reyna Valentina Ortiz Porras
