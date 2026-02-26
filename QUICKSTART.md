# 🚀 Quick Start - WealthHub

## 1️⃣ Iniciazafar Todo con Docker Compose (Recomendado) ⭐

```bash
cd /Users/mczm/workspace/wealthHub
docker-compose up --build
```

✅ **Frontend**: http://localhost:3000
✅ **Backend**: http://localhost:8000

Espera a que diga algo como:
```
frontend  | Local:   http://0.0.0.0:5173
backend   | Uvicorn running on http://0.0.0.0:8000
```

---

## 2️⃣ Alternativa: Sin Docker (Manual)

### Terminal 1 - Backend:

```bash
cd /Users/mczm/workspace/wealthHub/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Terminal 2 - Frontend:

```bash
cd /Users/mczm/workspace/wealthHub
npm install
npm run dev
```

---

## 3️⃣ Agregar Activos

Ir a: **http://localhost:3000** → Pestaña **💼 Activos**

Click en **"Nuevo Activo"** y agregar:

### Bitcoin
```
Nombre: Bitcoin
Ticker: BTC-EUR
Categoría: Crypto
```

### Fondo
```
Nombre: Numantia Patrimonio Global
ISIN: ES0165151004
Categoría: Fund
```

### Acción
```
Nombre: Apple Inc.
Ticker: AAPL
Categoría: Stock
```

---

## 4️⃣ Obtener Precios

En la misma pestaña **💼 Activos**, click en:
```
🔄 Obtener NAV Actual
```

✅ Debería ver un mensaje verde confirmando los precios obtenidos

---

## 5️⃣ Ver Resultados

- **📈 Historial**: Verá los nuevos precios
- **📊 Dashboard**: Se actualizará con los valores
- **💼 Activos**: Mostrarán NAV actual

---

## 📍 API Endpoints Disponibles

```bash
# Salud
curl http://localhost:8000/health

# Obtener precios mes actual
curl "http://localhost:8000/fetch-month?year=2024&month=2"

# Ver activos
curl http://localhost:8000/assets
```

---

## ⚙️ Configuración Google Apps Script (Opcional)

Para guardar en Google Drive:

1. Crear Google Apps Script vacío en https://script.google.com
2. Pegar script de `SETUP.md`
3. Deploy como "Web app"
4. Copiar URL en `backend/.env`:
```
GAS_URL=https://script.google.com/macros/s/[TU_ID]/exec
```
5. Reiniciar backend

---

## 🐛 Troubleshooting

| Error | Solución |
|-------|----------|
| `Port 3000 already in use` | `lsof -ti:3000 \| xargs kill -9` |
| `Port 8000 already in use` | `lsof -ti:8000 \| xargs kill -9` |
| `No se pudo conectar al backend` | Verificar backend está corriendo: `curl http://localhost:8000/health` |
| `No carga datos de GAS` | Sin GAS_URL configurado, usa localStorage (datos locales) |
| `npm not found` | Instalar Node.js desde nodejs.org |
| `python not found` | Instalar Python 3.9+ desde python.org |

---

## 📚 Documentación Completa

- **DOCKER.md** - Guía detallada de Docker
- **SETUP.md** - Guía completa de instalación
- **CAMBIOS.md** - Todos los cambios realizados
- **EJEMPLOS_ACTIVOS.md** - Ejemplos de activos
- **backend/README.md** - API documentation

---

**¡Listo para usar! 🎉**

Ahora tienes un sistema completamente automatizado para trackear precios de activos.
