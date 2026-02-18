# Rules Service

Stores user-defined rules and evaluates incoming measures. Triggers notifications when rules match.

**Port:** 3012  
**Auth:** JWT required for `/rules` endpoints

## Configuration

Create `.env` from `.env.example`:
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


## JSON Examples

### `POST /measures`
```json
{
  "sensorId": 3,
  "value": { "temperature": 21.4 },
  "timestamp": "2026-02-18T12:00:00Z",
  "isExternal": false
}
```

### `POST /rules`
```json
{
  "email": "user@example.com",
  "sensorId": 3,
  "operator": ">",
  "threshold": 25,
  "field": "temperature",
  "active": 1
}
```

## Capabilities
- Stores rules per user/sensor
- Evaluates incoming measures (internal + external)
- Triggers notifications when rules match

## Run
```
npm install
npm run dev
```
