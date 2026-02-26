# 🐳 WealthHub con Docker Compose

Guía rápida para ejecutar WealthHub completamente en Docker.

## ⚡ Quick Start (30 segundos)

```bash
cd /Users/mczm/workspace/wealthHub
docker-compose up --build
```

Eso es todo. Espera a que ambos contenedores estén listos.

## 📍 URLs Disponibles

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Health**: http://localhost:8000/health

## ✅ Verificar que Está Funcionando

```bash
# En otra terminal, verificar backend
curl http://localhost:8000/health

# Debería retornar:
# {"status":"healthy","message":"WealthHub Backend is running","version":"1.0.0"}
```

## 🗂️ Estructura con Docker

```
Docker Network: wealthhub-network
│
├── Backend (Python/FastAPI)
│   ├── Container: wealthhub-backend
│   ├── Port: 8000
│   ├── Volumes: ./backend (código con hot-reload)
│   └── Health Check: ✅ Automático
│
└── Frontend (Node/React/Vite)
    ├── Container: wealthhub-frontend
    ├── Port: 3000
    ├── Volumes: ./src, ./public (código con hot-reload)
    └── Depende de: Backend (health check)
```

## 🔄 Hot Reload (Desarrollo)

Ambos contenedores tienen **hot-reload automático**:

- Editar archivo en `src/` → Frontend se recarga
- Editar archivo en `backend/` → Backend se recarga

No necesitas reiniciar los contenedores.

## 🛑 Detener

```bash
docker-compose down
```

Esto detiene ambos contenedores y limpia.

## 🧹 Limpiar Todo

```bash
docker-compose down -v
```

Elimina contenedores, redes y volúmenes.

## 📊 Ver Logs

```bash
# Logs del backend
docker-compose logs backend -f

# Logs del frontend
docker-compose logs frontend -f

# Logs de ambos
docker-compose logs -f
```

## 🔐 Configuración de Google Apps Script

Si tienes un Google Apps Script configurado:

```bash
# Crear archivo .env con tu GAS_URL
echo 'GAS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec' > backend/.env
```

O editar directamente `backend/.env`:

```
FRONTEND_URL=http://localhost:3000,http://frontend:5173
GAS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
DEBUG=True
```

Luego reiniciar:

```bash
docker-compose restart backend
```

## 🐛 Troubleshooting

### "Port 3000 is already in use"

```bash
# Matar proceso en el puerto
lsof -ti:3000 | xargs kill -9
# Luego volver a ejecutar docker-compose
```

### "Port 8000 is already in use"

```bash
lsof -ti:8000 | xargs kill -9
```

### Backend no responde

```bash
# Verificar logs
docker-compose logs backend

# Reiniciar solo el backend
docker-compose restart backend
```

### Frontend no conecta con backend

Verificar que:
1. Backend está corriendo: `curl http://localhost:8000/health`
2. Variables de entorno correctas en `Dockerfile.frontend`
3. Browser console (F12) para ver errores CORS

### "No se pudo conectar al backend"

Este error significa que el frontend no puede alcanzar el backend. Verificar:

```bash
# Desde dentro del contenedor del frontend
docker-compose exec frontend curl http://backend:8000/health

# Debería retornar el JSON de health check
```

## 🔧 Variables de Entorno

### Backend (.env)

```env
FRONTEND_URL=http://localhost:3000,http://frontend:5173
GAS_URL=https://script.google.com/macros/s/YOUR_ID/exec
DEBUG=True
```

### Frontend (Dockerfile.frontend)

```env
VITE_BACKEND_URL=http://backend:8000
VITE_GAS_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

## 🚀 Comandos Útiles

```bash
# Levantar en background
docker-compose up -d

# Ver estado de contenedores
docker-compose ps

# Ejecutar comando en contenedor
docker-compose exec backend bash
docker-compose exec frontend bash

# Rebuild solo una imagen
docker-compose build backend
docker-compose build frontend

# Reiniciar todo
docker-compose restart

# Actualizar dependencias (pip/npm)
docker-compose down
docker rmi wealthhub-backend wealthhub-frontend
docker-compose up --build
```

## 📝 Notas Importantes

1. **Red Docker**: Frontend y Backend están en la misma red (`wealthhub-network`), por eso pueden comunicarse fácilmente

2. **URLs**: 
   - Desde navegador → `http://backend:8000` no funciona (necesita IP real)
   - Desde dentro del contenedor frontend → `http://backend:8000` sí funciona

3. **Persistencia**: Sin Google Apps Script, los datos se guardan en `localStorage` del navegador

4. **CORS**: Configurado automáticamente para ambas localidades (localhost:3000 y frontend:5173 en Docker)

## ✨ Próximas Mejoras

- [ ] PostgreSQL para persistencia
- [ ] Redis para caché
- [ ] Nginx reverse proxy
- [ ] CI/CD con GitHub Actions
- [ ] Monitoring con Prometheus

---

**¡Disfruta usando WealthHub con Docker! 🎉**
