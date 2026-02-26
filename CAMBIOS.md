# Cambios Realizados - Backend y Frontend

Resumen de todas las modificaciones realizadas al proyecto WealthHub para agregar funcionalidad de obtención automática de precios (NAV) de activos.

## Backend Nuevo (Python + FastAPI)

### Estructura Creada

```
backend/
├── main.py                  # 🆕 Aplicación principal FastAPI
├── models.py                # 🆕 Modelos Pydantic
├── config.py                # 🆕 Configuración
├── utils.py                 # 🆕 Utilidades
├── services/
│   ├── __init__.py          # 🆕 Init services
│   ├── price_fetcher.py     # 🆕 Integración yfinance
│   └── fund_scraper.py      # 🆕 Web scraper Morningstar/FT
├── requirements.txt         # 🆕 Dependencias Python
├── .env.example             # 🆕 Configuración de ejemplo
├── .gitignore               # 🆕 Git ignore
├── Dockerfile               # 🆕 Containerización
└── README.md                # 🆕 Documentación backend
```

### Funcionalidades Backend

✅ **Endpoint GET /fetch-month**
- Calcula automáticamente último día hábil del mes
- Obtiene precios de:
  - Bitcoin (BTC-EUR) vía yfinance
  - Acciones vía yfinance
  - Fondos vía Morningstar/FT (ISIN)
- Retorna precios en JSON
- Persiste en Google Apps Script

✅ **Integración yfinance**
- Clase `PriceFetcher` para obtener precios de stocks y BTC
- Soporte para múltiples tickers
- Manejo de errores y reintentos

✅ **Web Scraper para Fondos**
- Clase `FundScraper` para fondos por ISIN
- Morningstar como fuente primaria
- Financial Times como fallback
- Extracción robusta de NAV

✅ **Lógica de Fechas**
- Función `get_last_business_day()` para calcular último día hábil
- Evita fines de semana
- Validación de meses

✅ **CORS Configurado**
- Permite requests desde http://localhost:3000
- Configurable vía .env

✅ **Persistencia**
- Integración con Google Apps Script
- Merge de datos existentes con nuevos precios
- Actualización vs inserción inteligente

## Frontend Modificado (React/TypeScript)

### Cambios en Archivos Existentes

#### `src/types/index.ts` - 🔄 MODIFICADO
```typescript
// ✅ Agregados:
- Asset.isin? : string  // ISIN para fondos
- Asset.ticker?: string  // Ticker para stocks/crypto

// ✅ Nuevas interfaces:
- PriceData  // Datos de precio del backend
- FetchMonthResponse  // Respuesta del endpoint
```

#### `src/pages/Assets.tsx` - 🔄 MODIFICADO
```typescript
// ✅ Cambios principales:
- Import RefreshCw icon
- Estado adicional: isFetchingPrices, fetchMessage
- FormData.isin y FormData.ticker

// ✅ Nueva función:
- handleFetchPrices()  // Llama backend y actualiza precios
  → Obtiene precios mes actual
  → Actualiza historial
  → Muestra mensajes de estado

// ✅ Interfaz actualizada:
- Botón "Obtener NAV Actual" (RefreshCw icon)
- Campos ISIN y Ticker en formulario
- Mensaje de estado des fetching
```

#### `src/context/WealthContext.tsx` - ✅ SIN CAMBIOS
- Ya tenía `setHistory` disponible
- Compatible con nuevos datos de precios

## Nuevos Archivos de Documentación

### 📄 `SETUP.md` - 🆕
Guía completa de instalación y uso:
- Arquitectura del sistema
- Instalación paso a paso
- Google Apps Script setup
- Guía de uso
- API endpoints
- Troubleshooting
- Tipos de activos soportados

### 📄 `EJEMPLOS_ACTIVOS.md` - 🆕
Ejemplos de configuración:
- Bitcoin
- Fondos (Numantia, Vanguard, etc.)
- Acciones (AAPL, MSFT, etc.)
- Planes de pensiones
- ETFs
- Cómo encontrar ISIN/Ticker

## Nuevos Archivos de Deployment

### 🐳 `backend/Dockerfile` - 🆕
Container para backend:
- Python 3.11 slim base
- Instala dependencias
- Expone puerto 8000
- Comando uvicorn

### 📦 `docker-compose.dev.yml` - 🆕
Desarrollo con containers:
- Frontend (Node 18)
- Backend (Python)
- Volumes para code reload
- Profiles para dev

## Cambios en Dependencias

### Frontend - ✅ SIN CAMBIOS
- React/Vite/TypeScript ya tiene todo

### Backend - 🆕 NUEVAS
```
fastapi==0.104.1          # Framework web
uvicorn==0.24.0           # ASGI server
python-dotenv==1.0.0      # Variables de entorno
yfinance==0.2.32          # Precios Yahoo Finance
beautifulsoup4==4.12.2    # Web scraping
requests==2.31.0          # HTTP client
lxml==4.9.3               # Parser HTML
httpx==0.25.1             # Async HTTP
pydantic==2.5.0           # Validación datos
pydantic-settings==2.1.0  # Settings
python-dateutil==2.8.2    # Manipulación fechas
```

## Workflow Completo

```
1. Usuario en Frontend / pestaña Activos
   ↓
2. Click "Obtener NAV Actual"
   ↓
3. Frontend llama: GET /fetch-month?year=2024&month=2
   ↓
4. Backend:
   - Calcula último día hábil
   - Carga activos desde GAS
   - Organiza por tipo (crypto, fondos, stocks)
   - Obtiene precios:
     * Bitcoin → yfinance
     * Fondos → Morningstar/FT
     * Stocks → yfinance
   - Retorna {success, prices, errors}
   ↓
5. Frontend:
   - Actualiza historial (state)
   - Muestra mensaje éxito/errores
   - Historial se sincroniza automaticamente a GAS
   ↓
6. Visualizar:
   - Pestaña Activos: Nuevo NAV
   - Pestaña Historial: Nuevo registro
   - Dashboard actualizado
```

## Configuración Requerida

### Variables de Entorno Backend

`.env` del backend:
```
FRONTEND_URL=http://localhost:3000
GAS_URL=https://script.google.com/macros/d/[ID]/usercache
API_TITLE=WealthHub Backend API
DEBUG=True
```

### Modelos de Activos Actualizados

Estructura esperada para cada activo:
```typescript
{
  id: string              // UUID
  name: string            // "Bitcoin", "Apple", etc.
  category: string        // "Crypto", "Stock", "Fund", etc.
  color: string           // "#RRGGBB"
  ticker?: string         // "BTC-EUR", "AAPL"
  isin?: string          // "ES0165151004"
  baseAmount: number      // NAV actual
  archived: boolean
  targetAllocation?: number
  riskLevel?: string
}
```

## Compatibilidad

✅ **Frontend**
- React 18.2.0+
- TypeScript 5.2.2+
- Totalmente compatible

✅ **Backend**
- Python 3.9+
- FastAPI 0.104.1+
- Independiente, no requiere Node

✅ **APIs Externas**
- yfinance (gratuito, sin límite según términos)
- Morningstar (gratuito, público)
- Financial Times (gratuito, público)

## Testing Recomendado

### Backend
```bash
# Verificar salud
curl http://localhost:8000/health

# Obtener precios (febrero 2024)
curl "http://localhost:8000/fetch-month?year=2024&month=2"

# Ver activos
curl http://localhost:8000/assets
```

### Frontend
```bash
# Abrir en navegador
http://localhost:3000

# Click en pestaña "Activos"
# Click en "Obtener NAV Actual"
# Verificar mensaje de éxito
```

## Próximas Mejoras Sugeridas

- [ ] Cron job para auto-fetch de precios mensual
- [ ] Caché de precios para reducir requests
- [ ] Validación de ISIN/Ticker antes de guardar
- [ ] API de búsqueda de activos
- [ ] Exportar histórico a CSV
- [ ] Gráficos de performance
- [ ] Alertas de cambios de precio
- [ ] Múltiples carteras/usuarios

## Notas Importantes

1. **GAS (Google Apps Script)**
   - Opcional pero recomendado para persistencia
   - Sin GAS, los datos se guardan solo en localStorage
   - Ver SETUP.md para configuración

2. **Rate Limiting**
   - yfinance puede tener límites
   - Morningstar puede rechazar requests muy frecuentes
   - Se incluye retry logic y delays

3. **Moneda Base**
   - Sistema usa EUR como base
   - Todos los precios se obtienen en EUR
   - Configurable en futuro

4. **Último Día Hábil**
   - Se calcula automáticamente
   - Evita weekends
   - Importante para comparabilidad de datos

## Dudas o Problemas

Revisar:
1. `SETUP.md` - Guía completa
2. `backend/README.md` - Documentación backend
3. Logs de consola frontend
4. Logs de uvicorn en backend
5. NetworkTab del navegador

---
**Fecha:** Febrero 2024
**Versión:** 1.0.0
**Estado:** ✅ Listo para uso
