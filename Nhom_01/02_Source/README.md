## Installation and Running Setup

### Prerequisites
- Docker 
- Node.js v18+
- npm v9+ 
- PostgreSQL (for local development)

### Running Services

1. Start the repository:
    ```bash
    git clone [repository-url] # skip if you already have the repo
    cd Nhom_01/02_Source
    ```

2. Setup backend environment variables:
* Project service: `cd /project-service`
    - Create a `.env` file: `touch .env`
    - Paste the following values into the `.env` file:
    ```env
    # app configs
    APP_HOST=localhost
    APP_PORT=3333
    APP_VERSION=1

    # database configs
    DATABASE_URL=postgres://postgres:postgres@localhost:5433/project

    ```
* Timesheet service: `cd /timesheet-service`
    - Create a `.env` file: `touch .env`
    - Paste the following values into the `.env` file:
    ```.env
    # app configs
    APP_HOST=localhost
    APP_PORT=3334
    APP_VERSION=1

    # database configs
    DATABASE_URL=postgres://postgres:postgres@localhost:5434/timesheet
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

