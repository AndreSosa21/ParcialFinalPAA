
# 📡 Parcial III – Chat distribuido con WebSockets & Broker

Proyecto de chat en tiempo real para el curso **Patrones Arquitectónicos Avanzados**.

Implementa una arquitectura distribuida con:

- **API REST (Node.js + Express)**  
- **Servidor WebSocket**  
- **Worker** para procesamiento asíncrono  
- **Broker RabbitMQ** para desacoplar servicios  
- **Base de datos PostgreSQL**  
- **Frontend en React + TypeScript (Vite)**

Todo orquestado con **Docker Compose**.

---

## 1. 🧱 Arquitectura general

Componentes principales:

- **Frontend** (`frontend/`): SPA en React/TS que maneja:
  - Registro y login.
  - Lista de salas.
  - Creación de salas públicas/privadas.
  - Unirse a una sala (con contraseña si es privada).
  - Chat en vivo vía WebSocket (mensajes tipo WhatsApp).

- **API REST** (`backend/src/api`):
  - Autenticación JWT.
  - CRUD básico de **usuarios** y **salas**.
  - Endpoints para unirse a salas.
  - Endpoint REST opcional para enviar mensajes vía HTTP.

- **WebSocket Server** (`backend/src/websocket`):
  - Valida JWT.
  - Gestiona conexiones por sala.
  - Publica los mensajes en **RabbitMQ**.
  - Reenvía mensajes a todos los clientes conectados en la sala.

- **Worker** (`backend/src/worker`):
  - Consume mensajes desde la cola `chat_messages` en RabbitMQ.
  - Persiste mensajes en PostgreSQL.
  - Opcionalmente notifica de vuelta al servidor WS.

- **Broker RabbitMQ**:
  - Cola principal: `chat_messages`.
  - Desacopla envío/recepción de mensajes entre WS, API y Worker.

- **PostgreSQL** (`bd/`):
  - Tablas: `users`, `rooms`, `room_members`, `messages`, etc.
  - Scripts de inicialización y migraciones.
  - Consultas SQL optimizadas en `bd/queries/`.

Diagrama (conceptual):

```mermaid
flowchart LR
  FE[Frontend React] -- REST --> API
  FE -- WebSocket --> WS

  API -- JWT & SQL --> PG[(PostgreSQL)]
  API -- publish --> MQ[(RabbitMQ)]

  WS -- publish/consume --> MQ

  W[Worker] -- consume --> MQ
  W --> PG
```

---

## 2. 🧩 Tecnologías usadas

- **Backend**
  - Node.js 20
  - Express
  - `pg` (PostgreSQL)
  - `amqplib` (RabbitMQ)
  - `ws` (WebSocket)
  - JWT (`jsonwebtoken`)
  - Jest / Supertest (tests)

- **Infraestructura**
  - Docker / Docker Compose
  - PostgreSQL 15
  - RabbitMQ 3.12 (con consola de administración)

- **Frontend**
  - React + TypeScript
  - Vite
  - CSS modular simple

---

## 3. 📂 Estructura del proyecto

```bash
ParcialFinalPAA/
├── backend/
│   ├── docker/
│   │   ├── api.Dockerfile
│   │   ├── websocket.Dockerfile
│   │   └── worker.Dockerfile
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── validators/
│   │   ├── broker/
│   │   ├── config/
│   │   ├── db/
│   │   ├── websocket/
│   │   ├── worker/
│   │   └── app.js
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── scripts/
│   │   ├── load-test.js
│   │   └── metrics.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── config.ts
│   │   ├── login/
│   │   ├── register/
│   │   └── salas/
│   │       ├── salas/
│   │       ├── crear_sala/
│   │       ├── sala_vivo/
│   │       └── chat/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── bd/
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── init-db.sh
│   ├── init/
│   │   ├── 01_create_users.sql
│   │   ├── 02_create_rooms.sql
│   │   ├── 03_create_room_members.sql
│   │   ├── 04_create_messages.sql
│   │   ├── 05_create_indexes.sql
│   │   ├── 06_seed.sql
│   │   └── 07_add_token_version.sql
│   ├── migrations/
│   └── queries/
│       ├── get_room_messages_paginated.sql
│       ├── get_user_rooms.sql
│       ├── insert_message.sql
│       └── stress_test_queries.sql
│
├── docker-compose.yml
└── README.md
```

---

## 4. 🛠 Requisitos previos

- **Docker Desktop** (Windows/Mac) o Docker Engine (Linux)
- **Docker Compose**
- **Git**
- Opcional para desarrollo de frontend:
  - Node.js 20
  - npm

---

## 5. 🔐 Configuración de variables de entorno

### 5.1 Backend (`backend/.env`)

Ejemplo mínimo (coincide con `docker-compose.yml`):

```env
# PostgreSQL
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=chatdb

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

# JWT
JWT_SECRET=super_secret_jwt_for_parcial
JWT_EXPIRES_IN=1h

# API
API_PORT=3000

# WebSocket
WS_PORT=3001
```

> **Nota:** Existe un `.env.example` en `bd/` y configuración adicional en `backend/src/config`.

### 5.2 Frontend (`frontend/src/config.ts`)

```ts
export const API_URL = "http://localhost:3000";
export const WS_URL = "ws://localhost:3001";
```

Si corres todo en Docker y accedes desde el host, estos valores funcionan tal cual.

---

## 6. ▶️ Cómo levantar toda la aplicación

Desde la raíz del proyecto:

```bash
docker compose down -v
docker compose up -d --build
```

### 6.1 Verificar contenedores

```bash
docker ps
```

Deberían aparecer:

| Servicio       | Puerto host     | Estado   |
| ------------- | --------------- | -------- |
| postgres_chat | 5432            | healthy  |
| rabbitmq_chat | 5672 / 15672    | healthy  |
| api_chat      | 3000            | running  |
| websocket_chat| 3001            | running  |
| worker_chat   | —               | running  |

### 6.2 Verificar RabbitMQ

- URL: `http://localhost:15672`
- Usuario: `guest`
- Password: `guest`

En la consola se debe ver la cola `chat_messages` y el worker como **consumer**.

### 6.3 Verificar API

En Postman:

- `POST http://localhost:3000/auth/register`
- `POST http://localhost:3000/auth/login`

Más abajo hay una tabla detallada de endpoints.

### 6.4 Ejecutar frontend

**Opción A – Vite (desarrollo):**

```bash
cd frontend
npm install
npm run dev
```

Abrir: `http://localhost:5173`

**Opción B – Docker (si se configuró servicio `frontend` en docker-compose):**

```bash
docker compose up -d --build
```

Y luego: `http://localhost:5173`

---

## 7. 🌐 Endpoints principales de la API

> Todos los endpoints (salvo `register` y `login`) requieren header  
> `Authorization: Bearer <TOKEN_JWT>`.

### 7.1 Autenticación

| Método | Endpoint                | Descripción                     |
| ------ | ----------------------- | -------------------------------- |
| POST   | `/auth/register`        | Registrar usuario               |
| POST   | `/auth/login`           | Login, devuelve JWT + datos     |

**Ejemplo registro**

```json
POST /auth/register
{
  "username": "nico",
  "email": "nico@example.com",
  "password": "Nico1234!"
}
```

**Ejemplo login (respuesta resumida)**

```json
{
  "token": "JWT_AQUI",
  "user": {
    "id": 2,
    "username": "sam",
    "email": "samuelroul@unisabana.edu.co"
  }
}
```

---

### 7.2 Salas

| Método | Endpoint           | Descripción                       |
| ------ | ------------------ | --------------------------------- |
| GET    | `/rooms`           | Listar salas disponibles          |
| POST   | `/rooms`           | Crear sala (pública o privada)    |
| POST   | `/rooms/:id/join`  | Unirse a una sala (password opc.) |

**Crear sala pública**

```json
POST /rooms
{
  "name": "general",
  "type": "public"
}
```

**Crear sala privada**

```json
POST /rooms
{
  "name": "equipo",
  "type": "private",
  "password": "ClaveSegura123!"
}
```

**Unirse a sala**

```json
POST /rooms/1/join
{
  "password": ""
}
```

---

### 7.3 Mensajes (API REST)

| Método | Endpoint                       | Descripción                      |
| ------ | ------------------------------ | -------------------------------- |
| GET    | `/messages/:roomId/messages`   | Historial de mensajes de la sala |
| POST   | `/messages/:roomId/messages`   | Enviar mensaje vía API → Broker |

**Enviar mensaje vía API**

```json
POST /messages/1/messages
{
  "content": "Hola desde la API!"
}
```

Flujo resultante:

1. API valida JWT.
2. Publica mensaje en RabbitMQ (`chat_messages`).
3. Worker consume, guarda en PostgreSQL.
4. WS recibe y retransmite a todos los clientes en la sala.

---

## 8. 🔌 WebSocket

- URL: `ws://localhost:3001?token=JWT_AQUI`
- Autenticación: el token JWT va como **query param**.

### 8.1 Mensajes soportados

**Conexión:**

```json
{
  "type": "connected",
  "message": "WebSocket connection established"
}
```

**Unirse a sala (desde front):**

```json
{
  "type": "join_room",
  "room_id": 1
}
```

**Enviar mensaje (desde front):**

```json
{
  "type": "send_message",
  "room_id": 1,
  "content": "Hola desde WS"
}
```

**Broadcast a los clientes (ejemplo típico):**

```json
{
  "type": "message",
  "room_id": 1,
  "user_id": 2,
  "username": "sam",
  "content": "Hola!",
  "created_at": "2025-11-24T04:29:00.000Z"
}
```

---

## 9. 💻 Frontend (UX / flujo de uso)

Pantallas principales:

1. **Login / Registro**
   - Formularios con validación de formato:
     - Email válido.
     - Password con mayúscula, minúscula, número y carácter especial.
   - Mensajes de error amigables si el backend responde `400`.

2. **Listado de salas**
   - Chips con:
     - Nombre de la sala.
     - Tipo: 🌐 Pública / 🔒 Privada.
   - Botón `+ Crear nueva sala`.

3. **Crear sala**
   - Campos:
     - Nombre.
     - Tipo (select: pública/privada).
     - Contraseña (solo si es privada).
   - El frontend llama a `POST /rooms` y al finalizar redirige a la lista.

4. **Sala en vivo**
   - Muestra:
     - Nombre de la sala.
     - Tipo de sala.
     - Usuario logueado.
   - Para salas privadas: formulario para ingresar contraseña y hacer `join`.
   - Una vez unido (`join` OK) se monta el componente `Chat`.

5. **Chat**
   - Burbujas tipo WhatsApp:
     - Mensajes propios alineados a la **derecha**.
     - Mensajes de otros usuarios alineados a la **izquierda**, con su nombre.
   - Footer con input + botón “Enviar”.
   - Conexión WS:
     - “WS conectado / WS cerrado” en un pill de estado.
   - **Historial persistente:**
     - Al entrar la primera vez: `GET /messages/:roomId/messages`.
     - Si sales a “Salas” y vuelves a entrar, se vuelve a hacer GET y se repinta el historial.

---

## 10. 🧪 Pruebas y stress test

En `backend/tests` y `backend/scripts` se incluyen ejemplos de:

- **Unit tests (Jest)**  
  - Servicios de `auth`, `rooms`, `messages`.

- **Integration tests (Supertest)**  
  - Pruebas sobre endpoints reales (`/auth`, `/rooms`, `/messages`).

- **Stress test (load-test.js)**  
  - Simula varios usuarios enviando mensajes a la vez.
  - Mide latencia y rendimiento del stack completo.

Los comandos concretos pueden variar según `package.json`, pero una convención típica:

```bash
cd backend
npm test                # unit tests
npm run test:integration
node scripts/load-test.js
```

---

## 11. 📊 Colección de Postman

Colección pública para probar la API:

> https://final-fiber.postman.co/workspace/My-Workspace~65e19a6f-0576-4a59-8d2b-76bc79955d0c/collection/42374992-8dcb435b-62e1-4019-bb40-f19137425ebb?action=share&creator=42374992

Incluye:

- `auth` – Registro y login.
- `rooms` – CRUD básico y join.
- `messages` – envío vía API y consulta de historial.

---

## 12. 🔍 Flujo detallado API → Broker → Worker → DB → WS

```mermaid
sequenceDiagram
  participant U as Usuario
  participant FE as Frontend
  participant WS as WebSocket
  participant MQ as RabbitMQ
  participant W as Worker
  participant DB as PostgreSQL

  U->>FE: Escribe mensaje
  FE->>WS: send_message(room_id, content, token)
  WS->>MQ: publish(chat_messages)
  MQ->>W: entrega mensaje
  W->>DB: INSERT INTO messages
  W->>WS: opcionalmente notifica mensaje persistido
  WS->>FE: broadcast a todos los clientes en la sala
```

Beneficios:

- El servidor WS no queda bloqueado por escrituras a BD.
- Se puede escalar horizontalmente:
  - Varios servidores WS.
  - Varios workers conectados a RabbitMQ.
- Si la BD está momentáneamente caída, los mensajes quedan en cola.

---

## 13. 🎓 Decisiones técnicas y justificación

- **Arquitectura en capas (controllers/services/validators)**  
  Facilita pruebas unitarias y reemplazo de implementaciones.

- **Separación API / WS / Worker**  
  Cada servicio tiene una responsabilidad clara:
  - API: HTTP stateless + auth + endpoints REST.
  - WS: comunicación bidireccional en tiempo real.
  - Worker: tareas pesadas y persistencia.

- **RabbitMQ como broker**  
  Desacopla los servicios, permitiendo:
  - Retries automáticos.
  - Escalabilidad del consumo.
  - Monitoreo a través de la UI de RabbitMQ.

- **PostgreSQL + SQL explícito (`bd/queries`)**  
  Permite optimizar consultas complejas (paginación, índices).

- **Frontend en React + TS**  
  - TypeScript da tipado estático para props y datos del backend.
  - Vite ofrece un DX rápido para desarrollo.
  - El diseño UI enfatiza legibilidad, dark mode y feedback visual claro.

---

## 14. ✅ Checklist de validación final

- [x] `docker compose up -d --build` levanta **Postgres**, **RabbitMQ**, **API**, **WS** y **Worker**.
- [x] RabbitMQ muestra cola `chat_messages` y un consumidor activo.
- [x] Se puede:
  - [x] Registrar y hacer login (JWT válido).
  - [x] Crear sala pública y/o privada.
  - [x] Unirse a una sala (con contraseña si corresponde).
  - [x] Chatear en tiempo real desde dos navegadores distintos.
  - [x] Salir de la sala y volver a entrar manteniendo el historial.
- [x] Frontend consume API y WS del backend real.
- [x] Colección Postman disponible para evaluación.

---

> Cualquier profesor/compañero debería poder levantar todo el sistema siguiendo este README, revisar la arquitectura y verificar el flujo completo **usuario → frontend → API/WS → RabbitMQ → Worker → PostgreSQL → WebSocket → frontend**.
