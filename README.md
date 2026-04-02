# Kioskeys

Sitio multipágina construido con Vite.

## Desarrollo local

```bash
npm ci
npm run dev -- --host 0.0.0.0 --port 4173
```

## Build

```bash
npm run build
npm run preview
```

## Deploy previews automáticos (Netlify)

El repositorio está preparado para que Netlify haga **preview en vivo** en cada deploy:

- `netlify.toml` usa `npm ci && npm run build` para producción, branch deploys y deploy previews.
- El publish directory es `dist`.
- Se fija `NODE_VERSION=20` para evitar errores de build por versión de Node.

### Checklist en Netlify (una sola vez)

1. Conectar este repo en Netlify (`Add new site` -> `Import from Git`).
2. En `Site settings -> Build & deploy -> Continuous deployment` verificar:
   - **Production branch** configurada (ej. `main`).
   - **Deploy previews** activado para Pull Requests.
3. En `Site settings -> Environment variables` dejar (si no se toma automáticamente):
   - `NODE_VERSION=20`
4. Cada push/PR generará una URL de preview en vivo automáticamente.

## Rutas limpias

Se incluyen redirects en `netlify.toml` para mapear rutas como `/productos` a sus páginas HTML en `/pages/*.html`.
