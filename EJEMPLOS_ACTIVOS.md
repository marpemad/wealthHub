# Ejemplos de Configuración de Activos

Usa estos ejemplos como referencia para configurar tus activos en WealthHub.

## Bitcoin

```json
{
  "id": "btc-eur",
  "name": "Bitcoin",
  "category": "Crypto",
  "color": "#F7931A",
  "ticker": "BTC-EUR",
  "baseAmount": 0,
  "archived": false
}
```

## Fondos de Inversión

### Numantia Patrimonio Global

```json
{
  "id": "numantia-patrimonio-global",
  "name": "Numantia Patrimonio Global",
  "category": "Fund",
  "color": "#6366F1",
  "isin": "ES0165151004",
  "baseAmount": 0,
  "archived": false
}
```

### MULTIGESTION/BASALTO USA

```json
{
  "id": "multigestion-basalto-usa",
  "name": "MULTIGESTION/BASALTO USA",
  "category": "Fund",
  "color": "#10B981",
  "isin": "ES0164691083",
  "baseAmount": 0,
  "archived": false
}
```

### Vanguard U.S. 500 Stock Index Fund EUR Acc

```json
{
  "id": "vanguard-us-500",
  "name": "Vanguard U.S. 500 Stock Index Fund EUR Acc",
  "category": "Fund",
  "color": "#8B5CF6",
  "isin": "IE0032126645",
  "baseAmount": 0,
  "archived": false
}
```

### Renta 4 Multigestión Numantia Patrimonio Global FIES

```json
{
  "id": "renta4-numantia",
  "name": "Renta 4 Multigestión Numantia Patrimonio Global FIES",
  "category": "Fund",
  "color": "#EC4899",
  "isin": "ES0173311103",
  "baseAmount": 0,
  "archived": false
}
```

## Acciones Individuales

### Apple Inc.

```json
{
  "id": "aapl-stock",
  "name": "Apple Inc.",
  "category": "Stock",
  "color": "#555555",
  "ticker": "AAPL",
  "baseAmount": 0,
  "archived": false
}
```

### Microsoft

```json
{
  "id": "msft-stock",
  "name": "Microsoft",
  "category": "Stock",
  "color": "#00A4EF",
  "ticker": "MSFT",
  "baseAmount": 0,
  "archived": false
}
```

### Tesla

```json
{
  "id": "tsla-stock",
  "name": "Tesla",
  "category": "Stock",
  "color": "#E82127",
  "ticker": "TSLA",
  "baseAmount": 0,
  "archived": false
}
```

### Google/Alphabet

```json
{
  "id": "googl-stock",
  "name": "Alphabet Inc.",
  "category": "Stock",
  "color": "#4285F4",
  "ticker": "GOOGL",
  "baseAmount": 0,
  "archived": false
}
```

## Planes de Pensiones

### NUMANTIA PENSIONES PP N5430

```json
{
  "id": "numantia-pensiones-n5430",
  "name": "NUMANTIA PENSIONES PP N5430",
  "category": "Pension Plan",
  "color": "#06B6D4",
  "isin": "ES0110863031",
  "baseAmount": 0,
  "archived": false
}
```

## ETFs

### iShares MSCI World UCITS ETF

```json
{
  "id": "eunl-etf",
  "name": "iShares MSCI World UCITS ETF",
  "category": "Fund",
  "color": "#F59E0B",
  "isin": "IE0004880080",
  "baseAmount": 0,
  "archived": false
}
```

### Vanguard FTSE Developed World UCITS ETF

```json
{
  "id": "vwrl-etf",
  "name": "Vanguard FTSE Developed World UCITS ETF",
  "category": "Fund",
  "color": "#10B981",
  "ticker": "VWRL",
  "isin": "IE00BKX55T58",
  "baseAmount": 0,
  "archived": false
}
```

## Activos Adicionales

### Efectivo

```json
{
  "id": "cash",
  "name": "Cash",
  "category": "Efectivo",
  "color": "#22C55E",
  "baseAmount": 5000,
  "archived": false
}
```

### Bonos

```json
{
  "id": "bonos-estado-esp",
  "name": "Bonos Estado Español",
  "category": "Bond",
  "color": "#EF4444",
  "ticker": "BONOS-ES",
  "baseAmount": 0,
  "archived": false
}
```

## Notas Importantes

1. **ISIN vs Ticker**
   - Usa ISIN para fondos y bonos
   - Usa Ticker para acciones, ETFs y crypto
   - Algunos activos pueden tener ambos

2. **Categorías Soportadas**
   - Crypto
   - Fund
   - Stock
   - Pension Plan
   - Efectivo
   - Bond
   - Other

3. **Colores**
   - Elige un color distintivo para cada activo
   - Facilitará la visualización en gráficos

4. **baseAmount**
   - Coloca 0 si la posición está vacía
   - WealthHub lo actualizará automáticamente con el NAV que obtenga

5. **Archived**
   - Usa `true` para posiciones cerradas
   - Coloca `false` para posiciones activas

## Cómo Encontrar ISIN

### Para Fondos
1. Google: "[Nombre del Fondo] ISIN"
2. Morningstar.com
3. Sitio web del fondo o gestor
4. Tu broker

### Para Acciones
-Normalmente no necesitan ISIN (usa Ticker)
- El Ticker (ej: AAPL) es suficiente para yfinance

### Para Bonos/ETFs
- Sitio de emisor (para bonos)
- iShares, Vanguard, etc. (para ETFs)
- Tu broker

## Testing

Para verificar que un activo está bien configurado:

```bash
# En el backend, prueba manualmente:
curl "http://localhost:8000/fetch-month?year=2024&month=2"

# Deberías ver en los resultados o errores si se encontró el precio
```

## Troubleshooting

| Problema | Solución |
|----------|----------|
| "ISIN no encontrado en Morningstar" | Verificar ISIN es correcto, algunos no están disponibles |
| "Ticker no existe" | Verificar ticker en Yahoo Finance, usar símbolo correcto |
| "No data for BTC-EUR" | Usar "BTC-USD" o "BTC-EUR" según disponibilidad |
| "Fondo desconocido" | Puede no estar en Morningstar, probar con otro ISIN si existe |

