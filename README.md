# Rules Service

Stores user-defined rules and evaluates incoming measures. Triggers notifications when rules match.

**Port:** 3012  
**Auth:** JWT required for `/rules` endpoints

## Configuration

`.env`
```
PORT=3012
NOTIFICATION_SERVICE_URL=http://localhost:3013
INTERNAL_DATA_ADAPTER_URL=http://localhost:3001
JWT_SECRET=super-secret-key
```

`JWT_SECRET` must match AuthenticationService and other JWT-verifying services.

## API

### `POST /measures`
Receives measures from InternalDataAdapter or OrchestratorService.

### `POST /rules`
Creates a rule (JWT required).

### `GET /rules?email=...`
Retrieves rules for a user (JWT required).

### `PATCH /rules/:id/active`
Enable/disable a rule (JWT required).

### `GET /health`
Service health check.

## Run
```
npm install
npm run dev
```
