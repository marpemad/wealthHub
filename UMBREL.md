# WealthHub en Umbrel

Instrucciones para instalar y desplegar WealthHub como una aplicación en tu servidor Umbrel.

## Prerrequisitos

- Servidor Umbrel instalado y funcionando
- Acceso SSH al servidor Umbrel
- Docker instalado en el servidor (Umbrel ya lo incluye)

## Instalación en Umbrel

### Opción 1: Instalación desde GitHub (Recomendado)

1. **Conectar por SSH a tu servidor Umbrel:**

```bash
ssh ubuntu@umbrel.local
# o usa la IP de tu servidor Umbrel
ssh ubuntu@192.168.1.XXX
```

2. **Clonar el repositorio:**

```bash
cd ~/umbrel/app-data
git clone https://github.com/marpemad/wealthHub.git
```

4. **Configurar variables de entorno:**

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con tu editor preferido
nano .env
# o
vim .env
```

Asegúrate de que `VITE_GAS_URL` esté configurada con tu URL de Google Apps Script:

```env
VITE_GAS_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
```

5. **Iniciar la aplicación:**

```bash
docker compose up -d
```

6. **Verificar que la app está corriendo:**

```bash
docker ps | grep wealthhub
```

7. **Acceder a WealthHub:**

Abre tu navegador y ve a:
- `http://umbrel.local:3000`
- O `http://192.168.1.XXX:3000` (reemplaza XXX con la IP de tu Umbrel)

### Opción 2: Instalación Manual con Docker

Si prefieres gestionar la app con Umbrel directamente:

1. **Crear estructura en umbrel:**

```bash
ssh ubuntu@umbrel.local
mkdir -p ~/umbrel/apps/wealthhub
cd ~/umbrel/apps/wealthhub
```

2. **Clonar o descargar el repositorio:**

```bash
git clone https://github.com/marpemad/wealthHub.git .
# O descargar como ZIP y extraer
```

3. **Configurar archivo .env:**

```bash
cp .env.example .env
# Edita con tus valores
nano .env
```

4. **Ejecutar con docker-compose:**

```bash
docker-compose up -d
```

## Comandos Útiles

### Ver logs de la aplicación

```bash
docker logs -f wealthhub
```

### Detener la aplicación

```bash
docker-compose down
```

### Reconstruir la imagen

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Reiniciar la aplicación

```bash
docker-compose restart
```

### Actualizar desde repositorio

```bash
cd ~/umbrel/apps/wealthhub
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Configuración de Google Apps Script

Para sincronizar tus datos con Google Drive:

1. Crea un Google Apps Script en [script.google.com](https://script.google.com)
2. Configura el endpoint REST para recibir POST requests
3. Copia la URL del script publicado
4. Añádela a tu archivo `.env`:

```env
VITE_GAS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Persistencia de Datos

Los datos se almacenan en:
- **LocalStorage del navegador**: Base de datos local
- **Google Apps Script**: Copia de seguridad en la nube (si está configurado)
- **Volume Docker**: `/app/data` en el contenedor

**Nota**: Los datos de navegador se borran si limpias el caché del navegador. Asegúrate de hacer copias de seguridad regularmente desde la app.

## Solución de Problemas

### La app no es accesible

```bash
# Verificar que el contenedor está corriendo
docker ps | grep wealthhub

# Si no está corriendo, ver logs
docker logs wealthhub

# Verificar puerto
docker port wealthhub
```

### Error de conexión a GAS

- Verifica que `VITE_GAS_URL` esté correctamente configurada en `.env`
- Asegúrate de que la URL es accesible desde tu red
- Reinicia el contenedor después de cambiar `.env`

### Datos no se sincronizan

- Verifica logs: `docker logs -f wealthhub`
- Comprueba la conectividad a Google Apps Script
- Abre Dev Tools en el navegador (F12) y revisa la consola

### Cambios en .env no se aplican

Los cambios en `.env` requieren reconstruir la imagen:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Seguridad

- **Nunca** hagas commit de tu archivo `.env` con datos sensibles (ya está en `.gitignore`)
- La app se ejecuta en red local. Para acceso remoto, considera usar:
  - Nginx reverse proxy con SSL
  - Wireguard VPN de Umbrel
  - Cloudflare Tunnel

## Actualización

Para actualizar WealthHub:

```bash
cd ~/umbrel/apps/wealthhub
git pull origin main
docker-compose build --no-cache
docker-compose down
docker-compose up -d
```

## Soporte

Si encuentras problemas:
1. Revisa los logs: `docker logs wealthhub`
2. Consulta las issues en GitHub: https://github.com/marpemad/wealthHub/issues
3. Verifica que tu Umbrel está actualizado
