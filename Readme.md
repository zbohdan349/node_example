

## Installation

Clone the module and run next command

```bash
npm install 
```
Next, create and fill in the .env file (use .env.example and 'Environment variables' table for this)

### Environment variables

| No. | Variable name | Description | Default value |
| --- | --- | --- | --- |
| 1 | MONGODB_URL | Links to connect to MongoDB | *required |
| 2 | REDIS_HOST | Link to connect to Redis | localhost |
| 3 | REDIS_PORT | Port to connect to Redis | 6379 |
| 4 | REDIS_PASSWORD | Link to connect to Redis | |
| 5 | APP_PORT | The port on which the application is running | 3000 |
| 6 | JWT_ACCESS_SECRET | Secret key for generating ACCESS TOKEN | *required |
| 7 | JWT_REFRESH_SECRET | Secret key for generating REFRESH TOKEN | *required |
| 8 | ALLOWED_HOST | Allowed hosts to connect to (see “Express Settings”) | *required |

## Endpoints

The authorization server provides 3 endpoints:

1. login - Obtaining a new pair of `Access/Refresh Tokens`
2. renew - `Access Token` update
3. logout - Delete `Refresh Token`

### POST /login

Parameters (sent in the request body in `JSON` format):

```JSON
{
    "login": "USER_LOGIN",
    "password": "USER_PASSWORD"
}
```
Response:

#### 1. Successful login, status code 200

```json
{
    "accessToken": "ACCESS_TOKEN",
    "refreshToken": "REFRESH_TOKEN"
}
```

#### 2. Incorrect login data, status code 400

```json
{
    "err": "Credential is invalid"
}
```

#### 3. Generation error, status code 500

```json
{
    "err": "Server temporarily unavailable"
}
```

### POST /renew

`REFRESH_TOKEN` is transmitted in the body of the request in ``JSON`` format:

```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

Response:

#### 1. `REFRESH TOKEN` exists, status code 200

Issuing and sending a new `ACCESS TOKEN`

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

#### 2. `REFRESH TOKEN` does not exist, status code 401

```json
{
    "err": "REFRESH_TOKEN is invalid"
}
```

#### 3. Generation error, status code 500
```json
{
    "err": "Server temporarily unavailable"
}
```

### POST /logout

REFRESH_TOKEN is transmitted in the body of the request in `JSON` format:

```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

Response:

#### 1. `REFRESH TOKEN` exists, status code 200

The response body is missing


#### 2. `REFRESH TOKEN` does not exist, status code 401

```json
{
    "err": "REFRESH_TOKEN is invalid"
}
```

#### 3. Error connecting to Redis, status code 500
```json
{
    "err": "Server temporarily unavailable"
}
```