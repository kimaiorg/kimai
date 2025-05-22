## Installation and Running Setup

### Prerequisites

- Docker
- Node.js v18+
- npm v9+
- PostgreSQL (for local development)

### Running Services

0. **Run docker desktop.**

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

  TIMESHEET_SERVICE_URL=http://localhost:3334

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

3. Start services:

- At your command line, run the following command to start all services:
  ```cmd
  run.bat
  ```

### Running UI

```cmd
cd ui
npm run dev
```
