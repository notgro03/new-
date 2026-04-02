# GT Core — Pack de Arranque de Desarrollo

## 1) Estructura de carpetas recomendada

```txt
/
├─ apps/
│  ├─ web/                      # Frontend (Vite + JS/TS)
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  ├─ modules/
│  │  │  │  ├─ auth/
│  │  │  │  ├─ crm/
│  │  │  │  ├─ operations/
│  │  │  │  ├─ finance/
│  │  │  │  └─ admin/
│  │  │  ├─ shared/
│  │  │  └─ main.js
│  │  └─ index.html
│  └─ api/                      # Backend (NestJS/FastAPI)
│     ├─ src/
│     │  ├─ modules/
│     │  │  ├─ auth/
│     │  │  ├─ users/
│     │  │  ├─ roles/
│     │  │  ├─ crm/
│     │  │  ├─ operations/
│     │  │  ├─ finance/
│     │  │  └─ dashboard/
│     │  ├─ common/
│     │  └─ main.ts
│     └─ migrations/
├─ docs/
│  ├─ arquitectura.md
│  ├─ api-contracts.md
│  └─ decision-log.md
├─ infra/
│  ├─ docker/
│  ├─ compose.yml
│  └─ ci-cd/
└─ package.json
```

---

## 2) Migración SQL inicial (MVP)

> Crear archivo: `migrations/0001_gtcore_mvp.sql`

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  module VARCHAR(50) NOT NULL,
  action VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name VARCHAR(200) NOT NULL,
  tax_id VARCHAR(50),
  email VARCHAR(150),
  phone VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50),
  company_name VARCHAR(200),
  contact_name VARCHAR(150),
  email VARCHAR(150),
  status VARCHAR(30) NOT NULL DEFAULT 'new',
  owner_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  client_id UUID REFERENCES clients(id),
  title VARCHAR(200) NOT NULL,
  stage VARCHAR(30) NOT NULL DEFAULT 'discovery',
  amount_estimated NUMERIC(14,2),
  owner_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id),
  title VARCHAR(200) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'planning',
  assigned_manager_id UUID REFERENCES users(id),
  sla_due_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id),
  service_order_id UUID REFERENCES service_orders(id),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'issued',
  total NUMERIC(14,2) NOT NULL DEFAULT 0,
  balance NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  method VARCHAR(30),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  module VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  entity VARCHAR(80) NOT NULL,
  entity_id UUID,
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
```

---

## 3) Seed inicial de roles y permisos

> Crear archivo: `migrations/0002_seed_roles_permissions.sql`

```sql
INSERT INTO roles (code, name) VALUES
('super_admin', 'Super Admin'),
('gerencia', 'Gerencia'),
('comercial_manager', 'Comercial Manager'),
('ejecutivo_comercial', 'Ejecutivo Comercial'),
('operaciones_manager', 'Operaciones Manager'),
('operador', 'Operador'),
('finanzas', 'Finanzas');

INSERT INTO permissions (code, module, action) VALUES
('crm.leads.create', 'crm', 'create'),
('crm.leads.read', 'crm', 'read'),
('crm.leads.update', 'crm', 'update'),
('crm.quotes.approve', 'crm', 'approve'),
('operations.orders.create', 'operations', 'create'),
('operations.orders.read', 'operations', 'read'),
('operations.orders.update', 'operations', 'update'),
('finance.invoices.create', 'finance', 'create'),
('finance.invoices.read', 'finance', 'read'),
('finance.invoices.update', 'finance', 'update');
```

---

## 4) Plantilla de issues para Jira (copiar/pegar)

### Epic
- **Título:** `[EPIC] GT Core - CRM MVP`
- **Descripción:** Implementar gestión de leads, oportunidades, clientes y cotizaciones.
- **Criterio de salida:** Flujo de punta a punta desde lead hasta cotización aprobada.

### Historia de Usuario
- **Título:** `[US] Crear lead`
- **Como:** Ejecutivo comercial
- **Quiero:** Registrar un lead con datos básicos
- **Para:** Dar seguimiento comercial ordenado
- **Criterios de aceptación:**
  1. Permite crear lead con nombre de empresa y contacto.
  2. Estado inicial es `new`.
  3. Se registra auditoría de creación.
- **Definition of Done:**
  - PR aprobado
  - Tests de endpoint
  - QA funcional en staging

### Bug
- **Título:** `[BUG] No actualiza balance al registrar pago parcial`
- **Entorno:** Staging
- **Pasos para reproducir:** ...
- **Resultado actual:** ...
- **Resultado esperado:** ...
- **Severidad:** Alta

---

## 5) Comandos para levantar la página actual

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 4173
```

Luego abrir: `http://localhost:4173`

---

## 6) Checklist técnico de arranque (semana 1)

- [ ] Definir stack backend final (NestJS o FastAPI)
- [ ] Crear repositorio API separado o carpeta `apps/api`
- [ ] Configurar CI (lint + test + build)
- [ ] Configurar entorno `dev/staging/prod`
- [ ] Implementar Auth + RBAC + Auditoría
- [ ] Publicar documentación OpenAPI inicial
