## Installation and Running Setup

### Prerequisites

- Docker
- Node.js v18+
- npm v9+
- PostgreSQL (for local development)
- RabbitMQ

### Running Services

0. **Run docker desktop.**

- NOTE: **Please delete all volumes related to postgres and rabbitmq before continue**.

1. Start the repository:

   ```bash
   git clone [repository-url] # skip if you already have the repo
   cd Nhom_01/02_Source
   ```

2. Setup backend environment variables:

- Project service: `cd /project-service`

  - Create a `.env` file: `touch .env`
  - Paste the following values into the `.env` file:

  ```env
  # app configs
  APP_HOST=localhost
  APP_PORT=3333
  APP_VERSION=1

  # database configs
  DATABASE_URL=postgres://postgres:postgres@localhost:5433/project

  RABBITMQ_URL=amqp://root:root@localhost:5672

  TIMESHEET_SERVICE_URL=http://localhost

  INTERNAL_CODE=X9T4B7LQZV3MHG2JYAFWECNPDUK6SR80I5LO1XQBVUNZK3MTDY
  ```

- Timesheet service: `cd /timesheet-service`

  - Create a `.env` file: `touch .env`
  - Paste the following values into the `.env` file:

  ```.env
  # app configs
  APP_HOST=localhost
  APP_PORT=3334
  APP_VERSION=1

  # database configs
  DATABASE_URL=postgres://postgres:postgres@localhost:5434/timesheet

  AUTH0_DOMAIN=dev-r0btd5eozgc7ofkj.us.auth0.com

  RABBITMQ_URL=amqp://root:root@localhost:5672

  PROJECT_SERVICE_URL=http://localhost:3333

  INTERNAL_CODE=X9T4B7LQZV3MHG2JYAFWECNPDUK6SR80I5LO1XQBVUNZK3MTDY
  ```

- Invoice service: `cd /invoice-service`

  - Create a `.env` file: `touch .env`
  - Paste the following values into the `.env` file:

  ```.env
  # app configs
  APP_HOST=localhost
  APP_PORT=3335
  APP_VERSION=1

  # database configs
  DATABASE_URL=postgres://postgres:postgres@localhost:5435/invoice
  ```

- Notification service: `cd /notification-service`

  - Create a `.env` file: `touch .env`
  - Paste the following values into the `.env` file:

  ```.env
  # app configs
  APP_HOST=localhost
  APP_PORT=3336
  APP_VERSION=1

  # database configs
  DATABASE_URL=postgres://postgres:postgres@localhost:5436/notification
  AUTH0_DOMAIN=dev-r0btd5eozgc7ofkj.us.auth0.com

  RABBITMQ_URL=amqp://root:root@localhost:5672
  ```

- Report service: `cd /report-service`

  - Create a `.env` file: `touch .env`
  - Paste the following values into the `.env` file:

  ```.env
  # app configs
  APP_HOST=localhost
  APP_PORT=3337
  APP_VERSION=1

  # DATABASE_URL=postgres://postgres:postgres@localhost:5432/report
  TIMESHEET_SERVICE_URL=http://localhost:3334
  PROJECT_SERVICE_URL=http://localhost:3333
  NODE_ENV=development
  ```

- Api gateway service: `cd /api-gateway`

  - Create a `.env` file: `touch .env`
  - Paste the following values into the `.env` file:

  ```.env
  # app configs
  APP_HOST=localhost
  APP_PORT=3330

  # database configs
  TIMESHEET_SERVICE_URL=http://localhost
  PROJECT_SERVICE_URL=http://localhost:3333
  NOTIFICATION_SERVICE_URL=http://localhost:3336
  ```

3. Start services:

- At your command line, run the following command to start all services:
  ```cmd
  run.bat
  ```
- After all services are running, the seed data to the database container by running the following command:
  - Seed data for project service:

```
docker-compose exec postgres_database_for_project_service psql -U postgres -d project -f /docker-entrypoint-initdb.d/init.sql
```

- Seed data for timesheet service:

```
docker-compose exec postgres_database_for_timesheet_service psql -U postgres -d timesheet -f /docker-entrypoint-initdb.d/init.sql
```

- Seed data for invoice service:

```
docker-compose exec postgres_database_for_invoice_service psql -U postgres -d invoice -f /docker-entrypoint-initdb.d/init.sql
```

### Running UI

- Navigate to the `ui` directory and run the following command:

```cmd
cd ui
```

- Create a `.env` file: `touch .env`. Paste the following values into the `.env` file:

```env
AUTH0_SECRET='94d81cec4c193448cca74346c4b17ec4a23e13b5c67b035484ffb062738707a3'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://dev-r0btd5eozgc7ofkj.us.auth0.com'
AUTH0_CLIENT_ID='xBZ7jnlcHqlksyXxTDdg4EDStyyc2Q96'
AUTH0_CLIENT_SECRET='1oyLX_A3BKda3JpWyo3f94O_rJ3ApOjcL-_vDe0c_T4bufkmhwaFSsEENYwj8wts'
AUTH0_IAM_API_AUDIENCE='https://dev-r0btd5eozgc7ofkj.us.auth0.com/api/v2/'
AUTH0_KIMAI_API_AUDIENCE='kimai_api'
AUTH0_KIMAI_API_ID='67d98ea6626775c7c50f6298'

API_GATEWAY_URL=http://localhost:3330
INVOICE_BACKEND_URL=http://localhost:3335
REPORTING_BACKEND_URL=http://localhost:3337

AUTH0_USERNAME=superadmin@gmail.com
AUTH0_PASSWORD=Admin123@
```

- Install dependencies: `npm install -f`

- Start the development server: `npm run dev`
