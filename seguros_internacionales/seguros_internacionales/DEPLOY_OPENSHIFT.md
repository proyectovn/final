# Despliegue en Red Hat OpenShift - Sistema Internacional de Seguros

Repo monorepo: `backend/` (FastAPI), `frontend/` (React + Nginx) y `database/init.sql`.
Se despliegan 3 componentes, **en este orden**: MySQL → backend → frontend.

## 1. MySQL
Consola web → perspectiva **Developer** (o mediante YAML en Administrator) → **+Add → Database → MySQL (Ephemeral o Persistent)**.
Usa estos datos (o los tuyos, pero anótalos):

- MySQL Connection Username: `segurosuser` (o `root`)
- MySQL Connection Password: *(elige una nueva, ej. `secreto123`)*
- MySQL Database Name: `seguros_internacionales`
- Nombre del Service: `mysql`

Cargar las tablas (con `oc` en tu terminal, desde la raíz del repo, o pegando `database/init.sql` en la pestaña Terminal del pod):

```bash
oc get pods                                   # copia el nombre del pod mysql-xxxx
oc rsync database/ NOMBRE_POD_MYSQL:/tmp/
oc rsh NOMBRE_POD_MYSQL
mysql -u root -p seguros_internacionales < /tmp/database/init.sql
exit
```

## 2. Backend (FastAPI)
**+Add → Import from Git**
- Git Repo URL: `<URL_DE_TU_REPOSITORIO_GITHUB>`
- Show advanced Git options → **Context dir**: `/backend`
- Import Strategy: **Dockerfile**
- Name: **`backend`**  (el frontend lo busca con este nombre)
- Target port: `8080`
- **Desmarca** "Create a route" (solo lo usa el frontend, es interno)
- Deployment → Environment variables:
  - `DB_HOST=mysql`
  - `DB_PORT=3306`
  - `DB_USER=root`
  - `DB_PASS=<tu contraseña>`
  - `DB_NAME=seguros_internacionales`

Verifica en **Pods → Logs** que diga `Uvicorn running on http://0.0.0.0:8080`.

## 3. Frontend (React + Nginx)
**+Add → Import from Git**
- Mismo repo, **Context dir**: `/frontend`
- Import Strategy: **Dockerfile**
- Name: `frontend`
- Target port: `8080`
- **Marca** "Create a route" (esta es la URL pública)
- Si tu Service del backend tiene otro nombre, agrega la variable
  `BACKEND_URL=http://NOMBRE_DEL_SERVICE:8080`

## 4. Abrir la página
En **Topology**, pulsa el ícono ↗ del círculo `frontend`, o en **Networking → Routes** copia la columna *Location*.
Prueba el backend desde ahí: `https://TU-ROUTE/api/health` debe responder `{"status":"ok",...}`.

## Desarrollo local
```bash
# backend
cd backend && cp .env.example .env && pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# frontend (el proxy de vite.config.js manda /api a :8000)
cd frontend && npm install && npm run dev
```
