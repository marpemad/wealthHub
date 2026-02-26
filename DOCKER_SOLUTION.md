# Solución: GAS y Backend en Docker

## Problemas Resueltos ✅

1. ❌ **No cargaba historial desde Google Apps Script**
   - ✅ Ahora el frontend intenta cargar GAS con la URL configurada
   - ✅ Si no hay GAS_URL, usa localStorage como fallback
   - ✅ Todo se sincroniza automáticamente

2. ❌ **Error al hacer fetch del NAV**
   - ✅ Frontend ahora usa `config.backendUrl` en lugar de hardcodear localhost:8000
   - ✅ En Docker, el frontend se conecta al backend usando `http://backend:8000`
   - ✅ CORS está configurado correctamente en el backend

3. ❌ **Todo se levanta con docker-compose**
   - ✅ `docker-compose.yml` completamente funcional
   - ✅ Ambos contenedores en la misma red
   - ✅ Health checks automáticos
   - ✅ Hot-reload en ambos

---

## 🚀 Cómo Usar

### Opción 1: Docker Compose (Recomendado)

```bash
cd /Users/mczm/workspace/wealthHub
docker-compose up --build
```

**Eso es todo.** Espera a que salga:
```
backend   | Uvicorn running on http://0.0.0.0:8000
frontend  | ➜  Local:   http://0.0.0.0:5173
```

Abre en navegador: http://localhost:3000

### Opción 2: Helper Script

```bash
cd /Users/mczm/workspace/wealthHub

# Iniciar
./wealthhub.sh up

# Ver logs
./wealthhub.sh logs
./wealthhub.sh logs backend
./wealthhub.sh logs frontend

# Ver estado
./wealthhub.sh status

# Detener
./wealthhub.sh down

# Reiniciar
./wealthhub.sh restart

# Limpiar todo
./wealthhub.sh clean
```

### Opción 3: Manual (Sin Docker)

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

# Terminal 2: Frontend
cd /Users/mczm/workspace/wealthHub
npm install
npm run dev
```

---

## 🔧 Flujo de Variables de Entorno

### En Docker:

```
docker-compose.yml
    ↓
    ├─ backend:
    │   └─ FRONTEND_URL=http://localhost:3000,http://frontend:5173
    │   └─ GAS_URL=${GAS_URL}        ← desde .env local
    │
    └─ frontend:
        └─ VITE_BACKEND_URL=http://backend:8000
        └─ VITE_GAS_URL=${VITE_GAS_URL}      ← desde .env local
```

### En Navegador (Desde host):

```
http://localhost:3000 (frontend en el navegador de tu PC)
    ↓
fetch(http://localhost:8000/fetch-month)    ← DESDE TU PC
    ↓
Backend responde en http://localhost:8000
```

### Desde dentro del contenedor frontend:

```
http://backend:8000    ← Funciona porque están en la misma red Docker
```

---

## ✅ Verificaciones

### 1. Backend está corriendo

```bash
curl http://localhost:8000/health
```

Debería retornar:
```json
{
  "status": "healthy",
  "message": "WealthHub Backend is running",
  "version": "1.0.0"
}
```

### 2. Frontend puede conectar con backend

En la consola del navegador (F12):
```javascript
fetch('http://localhost:8000/health').then(r => r.json()).then(console.log)
```

### 3. CORS está funcionando

Si no ves errores de CORS en la consola, está bien configurado.

```
Debería FUNCIONAR:
✅ POST a http://localhost:8000 desde http://localhost:3000

Debería FALLAR (sin CORS):
❌ POST a http://localhost:8000 desde http://otro-sitio.com
```

---

## 📊 Google Apps Script

### Sin GAS configurado:
- Datos se guardan en `localStorage` del navegador
- Solo visible en ese navegador
- Se pierde al limpiar cache

### Con GAS configurado:
- Datos se sincronizan a Google Drive
- Visible desde cualquier navegador
- Persistencia en la nube

### Para configurar GAS:

1. Ir a https://script.google.com
2. Crear nuevo proyecto
3. Pegar script de `SETUP.md` (sección "Google Apps Script")
4. Deploy como "New" → "Web app"
5. Copiar URL: `https://script.google.com/macros/s/YOUR_ID/exec`
6. Editar `backend/.env`:
   ```
   GAS_URL=https://script.google.com/macros/s/YOUR_ID/exec
   ```
7. Reiniciar backend: `docker-compose restart backend`

---

## 🔍 Archivos Modificados

### Frontend
- ✅ `src/config/index.ts` - Agrega URL del backend
- ✅ `src/pages/Assets.tsx` - Usa config.backendUrl
- ✅ `src/types/index.ts` - Nuevas interfaces

### Backend
- ✅ `backend/main.py` - CORS mejorado con múltiples URLs
- ✅ `backend/config.py` - Soporta múltiples FRONTEND_URL

### Docker
- ✅ `docker-compose.yml` - Config completa
- ✅ `Dockerfile.frontend` - Imagen del frontend
- ✅ `backend/Dockerfile` - Imagen del backend

### Configuración
- ✅ `.env` - Frontend config
- ✅ `.env.local` - Frontend local
- ✅ `.env.docker` - Frontend en docker
- ✅ `backend/.env` - Backend config

### Scripts
- ✅ `wealthhub.sh` - Helper script

---

## 🎯 Casos de Uso

### Desarrollo Local (Sin Docker)

```bash
npm run dev
python main.py

# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Config: VITE_BACKEND_URL=http://localhost:8000
```

### Desarrollo con Docker

```bash
docker-compose up --build

# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Config: VITE_BACKEND_URL=http://backend:8000 (dentro del container)
```

### Producción (Future)

```bash
# Build images
docker build -t wealthhub-backend ./backend
docker build -t wealthhub-frontend .

# Deploy (AWS, GCP, etc)
```

---

## 🐛 Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `❌ Error: No se pudo conectar al backend` | Backend no está corriendo | `docker-compose logs backend` |
| `CORS error en network` | Frontend no autorizado en backend | Verificar FRONTEND_URL en backend/.env |
| `No carga datos de GAS` | GAS_URL no configurada | Configurar en backend/.env o dejar vacía para localStorage |
| `Port 3000 already in use` | Otro proceso usa el puerto | `lsof -ti:3000 \| xargs kill -9` |
| `Port 8000 already in use` | Otro proceso usa el puerto | `lsof -ti:8000 \| xargs kill -9` |

---

## 📚 Documentación

- **QUICKSTART.md** - Guía rápida (30 segundos)
- **DOCKER.md** - Guía completa de Docker
- **SETUP.md** - Instalación y configuración
- **CAMBIOS.md** - Todos los cambios realizados

---

**¡Sistema completamente funcional! 🎉**
