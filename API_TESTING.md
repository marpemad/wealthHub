# WealthHub Backend API - Ejemplos de Testing

Este archivo contiene ejemplos de peticiones a los endpoints del backend para que puedas probar y debuggear.

## Base URL
```
http://localhost:8000
```

---

## 1. Health Check

Verifica que el backend está corriendo:

```bash
curl -v http://localhost:8000/health
```

**Respuesta esperada (200 OK):**
```json
{
  "status": "healthy",
  "message": "WealthHub Backend is running",
  "version": "1.0.0"
}
```

---

## 2. Fetch Prices for Current Month

Obtiene los precios de todos los activos para el mes y año actual:

```bash
# Febrero 2026
curl -v "http://localhost:8000/fetch-month?year=2026&month=2"
```

**Parámetros:**
- `year`: Año (ej: 2026)
- `month`: Mes 1-12 (ej: 2 para febrero)

**Respuesta esperada (200 OK):**
```json
{
  "success": true,
  "message": "Successfully fetched 3 prices",
  "year": 2026,
  "month": 2,
  "lastBusinessDay": "2026-02-27",
  "prices": [
    {
      "assetId": "btc-usd",
      "assetName": "Bitcoin",
      "ticker": "BTC-EUR",
      "price": 65432.50,
      "currency": "EUR",
      "source": "yfinance",
      "fetchedAt": "2026-02-27T16:30:00Z"
    },
    {
      "assetId": "numantia-patrimonio",
      "assetName": "Numantia Patrimonio Global",
      "isin": "ES0165151004",
      "price": 45.82,
      "currency": "EUR",
      "source": "morningstar",
      "fetchedAt": "2026-02-27T18:00:00Z"
    },
    {
      "assetId": "aapl-stock",
      "assetName": "Apple Inc.",
      "ticker": "AAPL",
      "price": 198.75,
      "currency": "EUR",
      "source": "yfinance",
      "fetchedAt": "2026-02-27T17:45:00Z"
    }
  ],
  "errors": []
}
```

---

## 3. Pruebas Individuales por Tipo de Activo

### 3.1 Bitcoin (BTC-EUR)

```bash
curl -v "http://localhost:8000/fetch-month?year=2026&month=2"
```

**Qué hace:** Busca el precio de BTC-EUR usando `yfinance`

**Fuente:** yfinance  
**Ticker:** BTC-EUR

---

### 3.2 Fondos (ISIN)

El backend debería obtener fondos que tengan un ISIN configurado:

```bash
curl -v "http://localhost:8000/fetch-month?year=2026&month=2"
```

**Fondos de ejemplo en el sistema:**
- **Numantia Patrimonio Global** - ISIN: `ES0165151004`
- Otros fondos que puedas agregar en la app

**Fuentes:** 
1. Morningstar (primaria)
2. Financial Times (fallback)

---

### 3.3 Stocks/Acciones

El backend obtiene stocks que tienen un `ticker` y categoría "Stock" o "Stocks":

```bash
curl -v "http://localhost:8000/fetch-month?year=2026&month=2"
```

**Stocks de ejemplo:**
- **Apple Inc.** - Ticker: `AAPL`
- Otros que puedas agregar (ej: MSFT, GOOGL, TSLA, etc.)

**Fuente:** yfinance

---

## 4. Get Assets

Obtiene la lista de activos (desde GAS o sample assets):

```bash
curl -v http://localhost:8000/assets
```

**Respuesta esperada:**
```json
{
  "success": true,
  "assets": [
    {
      "id": "btc-usd",
      "name": "Bitcoin",
      "category": "Crypto",
      "ticker": "BTC-EUR",
      "color": "#F7931A",
      "baseAmount": 5000,
      "archived": false
    },
    {
      "id": "numantia-patrimonio",
      "name": "Numantia Patrimonio Global",
      "category": "Fund",
      "isin": "ES0165151004",
      "color": "#6366F1",
      "baseAmount": 10000,
      "archived": false
    },
    {
      "id": "aapl-stock",
      "name": "Apple Inc.",
      "category": "Stock",
      "ticker": "AAPL",
      "color": "#555555",
      "baseAmount": 3000,
      "archived": false
    }
  ]
}
```

---

## 5. Update Prices (Manual)

Actualiza precios manualmente (POST):

```bash
curl -X POST http://localhost:8000/update-prices \
  -H "Content-Type: application/json" \
  -d '[
    {
      "assetId": "btc-usd",
      "assetName": "Bitcoin",
      "ticker": "BTC-EUR",
      "price": 65000.00,
      "currency": "EUR",
      "source": "manual",
      "fetchedAt": "2026-02-27T18:00:00Z"
    },
    {
      "assetId": "aapl-stock",
      "assetName": "Apple Inc.",
      "ticker": "AAPL",
      "price": 200.50,
      "currency": "EUR",
      "source": "manual",
      "fetchedAt": "2026-02-27T18:00:00Z"
    }
  ]'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Updated 2 prices",
  "prices": [...]
}
```

---

## Debugging

### Si `/fetch-month` devuelve errores:

1. **Verifica que el backend está corriendo:**
   ```bash
   curl -v http://localhost:8000/health
   ```

2. **Verifica los logs del backend:**
   ```bash
   docker-compose logs backend --tail=100
   ```

3. **Prueba individual de yfinance (BTC):**
   ```python
   import yfinance as yf
   btc = yf.Ticker("BTC-EUR")
   print(btc.history(period="1d"))
   ```

4. **Prueba individual de un stock:**
   ```python
   import yfinance as yf
   apple = yf.Ticker("AAPL")
   print(apple.history(period="1d"))
   ```

5. **Resetea los containers:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

---

## Configuración de Activos

Para que el `/fetch-month` encuentre tus activos, necesitas asegurarte de que:

1. **Para Crypto:** El activo tenga `"ticker": "BTC-EUR"` 
2. **Para Fondos:** El activo tenga un campo `"isin"` válido
3. **Para Stocks:** El activo tenga un campo `"ticker"` y `"category"` sea "Stock" o "Stocks"

### Ejemplo de Asset con todos los campos:

```json
{
  "id": "asset-123",
  "name": "Apple Inc.",
  "category": "Stock",
  "ticker": "AAPL",
  "isin": null,
  "color": "#555555",
  "baseAmount": 3000,
  "archived": false
}
```

---

## Postman Collection

Si prefieres usar Postman, aquí está la colección:

```json
{
  "info": {
    "name": "WealthHub Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/health"
      }
    },
    {
      "name": "Fetch Prices",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/fetch-month?year=2026&month=2"
      }
    },
    {
      "name": "Get Assets",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/assets"
      }
    },
    {
      "name": "Update Prices",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": "{{base_url}}/update-prices",
        "body": {
          "mode": "raw",
          "raw": "[{\"assetId\":\"btc-usd\",\"assetName\":\"Bitcoin\",\"ticker\":\"BTC-EUR\",\"price\":65000,\"currency\":\"EUR\",\"source\":\"manual\",\"fetchedAt\":\"2026-02-27T18:00:00Z\"}]"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000",
      "type": "string"
    }
  ]
}
```

Importa este JSON en Postman y reemplaza `{{base_url}}` con `http://localhost:8000`.

---

## Issues Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `ERR_NAME_NOT_RESOLVED` | Frontend no puede resolver `http://backend:8000` | Backend URL debe ser `http://localhost:8000` en la variable `VITE_BACKEND_URL` cuando se accede desde el navegador |
| `Connection refused` | Backend no está corriendo | Ejecuta `docker-compose up` |
| `ERR_CONNECTION_REFUSED` | Puerto 8000 no disponible | Cambia el puerto en `docker-compose.yml` |
| `yfinance` no trae datos | ISIN/Ticker inválido | Verifica el ticker en [yfinance](https://finance.yahoo.com) |
| `Morningstar` no trae datos | ISIN no válido o no existe | Verifica el ISIN en [Morningstar](https://www.morningstar.es) |

