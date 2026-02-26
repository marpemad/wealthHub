# WealthHub - Sistema Completo de Gestión de Finanzas

Sistema de seguimiento de patrimonio con obtención automática de precios de activos (NAV) al cierre de mes.

## Arquitectura

```
Frontend (React/Vite)          Backend (FastAPI)              Google Apps Script
┌──────────────────┐          ┌──────────────────┐            ┌──────────────┐
│  Dashboard       │◄────────►│  /fetch-month    │◄──────────►│  data.json   │
│  Activos (ISIN)  │          │  /update-prices  │            │  (histórico) │
│  Bitcoin/Stocks  │          │  /health         │            │              │
│  Historial       │          │  /assets         │            │ (persistencia)│
└──────────────────┘          └──────────────────┘            └──────────────┘
     :3000                          :8000                    script.google.com
```

## Requisitos Previos

### 1. Node.js y npm
```bash
node --version  # v18+
npm --version   # v8+
```

### 2. Python 3.9+
```bash
python --version  # 3.9+
pip --version
```

### 3. Google Apps Script (Opcional pero recomendado)
Para persistencia en la nube, necesitas crear un Google Apps Script que actúe como API.

## Instalación Rápida

### Opción 1: Con Docker Compose (Recomendado) ⭐

```bash
cd /Users/mczm/workspace/wealthHub

# Iniciar frontend + backend
docker-compose up --build
```

✅ Frontend: http://localhost:3000
✅ Backend: http://localhost:8000

**Eso es todo.** Todo funciona automáticamente.

### Opción 2: Manual (Sin Docker)

#### Frontend

```bash
cd /Users/mczm/workspace/wealthHub

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Frontend estará en `http://localhost:3000`

#### Backend (En otra terminal)

```bash
cd /Users/mczm/workspace/wealthHub/backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # macOS/Linux

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python main.py
```

Backend estará en `http://localhost:8000`

---

### Google Apps Script (Opcional)

Para guardar datos en Google Drive:

1. Ir a [Google Apps Script](https://script.google.com)
2. Crear nuevo proyecto
3. Pegar el script de abajo
4. Deploy como "New" → "Web app"
5. Copiar la URL de deploy en `.env` como `GAS_URL`

```javascript
// Google Apps Script (doPost/doGet)
function doGet(e) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const dataJson = scriptProperties.getProperty('data') || '{}';
  
  try {
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: JSON.parse(dataJson),
      timestamp: new Date().toISOString()
    }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const payload = JSON.parse(e.postData.contents);
  
  try {
    // Cargar datos existentes
    const existingData = JSON.parse(scriptProperties.getProperty('data') || '{}');
    
    // Mergear datos (action: updateHistory, updateAssets, etc.)
    if (payload.action === 'updateHistory') {
      existingData.history = payload.history || [];
    } else if (payload.action === 'updateAssets') {
      existingData.assets = payload.assets || [];
    } else {
      // Mergear todo
      Object.assign(existingData, payload);
    }
    
    // Guardar
    scriptProperties.setProperty('data', JSON.stringify(existingData));
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data updated',
      timestamp: new Date().toISOString()
    }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Uso

### 1. Agregar Activos

En la pestaña **Activos**:
- Click en "Nuevo Activo"
- Rellenar nombre, categoría, color
- **Importante**: Agregar ISIN o Ticker:
  - **ISIN**: Para fondos (ej: ES0165151004)
  - **Ticker**: Para acciones/crypto (ej: AAPL, BTC-EUR)
- Guardar

### 2. Obtener Precios Automáticamente

En la pestaña **Activos**:
- Click en "Obtener NAV Actual"
- Se fetcharán automáticamente los precios del:
  - Mes actual (o último disponible)
  - Último día hábil del mes
- Los precios se guardarán en el historial

### 3. Ver Historial

En la pestaña **Historial**:
- Ver todos los registros por mes
- Editar o eliminar registros manualmente si es necesario

## Configuración de Activos por Tipo

### Bitcoin/Crypto
```
Nombre: Bitcoin
Ticker: BTC-EUR
Categoría: Crypto
```

### Fondos de Inversión
```
Nombre: Numantia Patrimonio Global
ISIN: ES0165151004
Categoría: Fund
```

### Acciones
```
Nombre: Apple Inc.
Ticker: AAPL
Categoría: Stock
```

### Planes de Pensiones
```
Nombre: NUMANTIA PENSIONES PP N5430
ISIN: ES0173311103  (o ticker si disponible)
Categoría: Pension Plan
```

## API del Backend

### GET /health
Verifica que el backend está corriendo.

```bash
curl http://localhost:8000/health
```

### GET /fetch-month?year=2024&month=2
Obtiene precios para todos los activos configurados.

```bash
curl "http://localhost:8000/fetch-month?year=2024&month=2"
```

Respuesta:
```json
{
  "success": true,
  "message": "Successfully fetched 3 prices",
  "year": 2024,
  "month": 2,
  "lastBusinessDay": "2024-02-29",
  "prices": [
    {
      "assetId": "btc-usd",
      "assetName": "Bitcoin",
      "ticker": "BTC-EUR",
      "price": 42500.50,
      "currency": "EUR",
      "fetchedAt": "2024-02-26T18:30:00Z",
      "source": "yfinance"
    }
  ],
  "errors": []
}
```

### GET /assets
Obtiene lista de activos del GAS.

```bash
curl http://localhost:8000/assets
```

### POST /update-prices
Actualiza precios manualmente.

```bash
curl -X POST http://localhost:8000/update-prices \
  -H "Content-Type: application/json" \
  -d '[{
    "assetId": "btc",
    "assetName": "Bitcoin",
    "ticker": "BTC-EUR",
    "price": 42500,
    "currency": "EUR",
    "fetchedAt": "2024-02-26T18:30:00Z",
    "source": "manual"
  }]'
```

## Fuentes de Datos

| Tipo | Fuente Primaria | Fuente Secundaria |
|------|---|---|
| Bitcoin | yfinance | - |
| Acciones | yfinance | - |
| Fondos | Morningstar (ISIN) | Financial Times |
| Planes Pensiones | yfinance o Morningstar | - |

## Troubleshooting

### "Failed to fetch Bitcoin price"
- Verificar conexión a internet
- Verificar que yfinance no esté rate-limitado
- Intentar con ticker diferente (ej: BTC-USD)

### "Failed to fetch fund price"
- Verificar que el ISIN es correcto
- El fondo debe existir en Morningstar
- Algunos ISINs pueden no estar disponibles

### "GAS URL not configured"
- Copiar .env.example a .env
- Agregar tu GAS_URL

### Backend no responde
```bash
# Verificar que está corriendo
curl http://localhost:8000/health

# Ver logs
# El servidor mostrará "Uvicorn running on"
```

### Frontend no conecta con backend
- Verificar CORS: backend debería permitir http://localhost:3000
- Verificar que el backend está en puerto 8000
- En navigador, developer tools → Network → ver requests

## Próximas Mejoras

- [ ] Autenticación con Google
- [ ] Dashboard con gráficos de rendimiento
- [ ] Notificaciones de cambios de precios
- [ ] Exportar reports a PDF
- [ ] Predicciones con ML
- [ ] Integración con más brokers

## Estructura del Proyecto

```
/wealthHub
├── src/                          # Frontend React
│   ├── pages/
│   │   ├── Assets.tsx          # ← Panel de activos + botón fetch NAV
│   │   ├── History.tsx         # ← Ver histórico de precios
│   │   ├── Dashboard.tsx
│   │   ├── Bitcoin.tsx
│   │   ├── Stocks.tsx
│   │   └── ...
│   ├── context/
│   │   └── WealthContext.tsx   # ← Estado global + sincronización
│   ├── services/
│   ├── components/
│   └── types/
│       └── index.ts            # ← Tipos TypeScript (Asset, PriceData, etc.)
│
└── backend/                      # Backend FastAPI
    ├── main.py                 # ← Aplicación principal + endpoints
    ├── models.py               # ← Modelos Pydantic
    ├── config.py               # ← Configuración
    ├── utils.py                # ← Utilidades (cálculo de fechas, etc.)
    ├── services/
    │   ├── price_fetcher.py   # ← yfinance para stocks/BTC
    │   └── fund_scraper.py    # ← BeautifulSoup para fondos
    ├── requirements.txt        # ← Dependencias Python
    ├── .env.example           # ← Configuración de ejemplo
    └── README.md              # ← Documentación del backend
```

## Licencia

Privado - Proyecto WealthHub
