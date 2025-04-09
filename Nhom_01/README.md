# Kimai - Time and Expense Tracking System

## Overview
Kimai is a comprehensive time tracking and expense management system designed to help companies manage employee working hours and generate customer invoices.

## System Architecture
The system follows a microservices architecture with the following components:

```
Nhom_01/
├── 01_Documents/        # Project documentation
├── 02_Source/           # Source code
│   ├── invoice-service/     # Invoice generation service
│   ├── notification-service/ # Notification service
│   ├── project-service/      # Core project management service
│   ├── timesheet-service/    # Timesheet management
│   ├── ui/                   # Next.js frontend
│   └── docker-compose.yaml   # Docker configuration
└── 03_Deployment/       # Deployment configurations
```

## Services Documentation

### Project Service (`project-service/`)
Core service for project management with domain-driven design architecture.

**Key Features:**
- Customer management
- Project tracking
- Task assignment
- Team organization

**Tech Stack:**
- NestJS framework
- Prisma ORM
- Modular architecture (api/domain/infrastructure)

### Timesheet Service (`timesheet-service/`)
Time tracking and reporting system.

**Key Features:**
- Time entry recording
- Timesheet approval workflow
- Reporting and analytics

**Tech Stack:**
- NestJS framework
- PostgreSQL database
- JWT authentication

### Invoice Service (`invoice-service/`)
Invoice generation and billing system.

**Key Features:**
- Automated invoice generation
- Billing calculations
- PDF export
- Payment tracking

**Tech Stack:**
- NestJS framework
- PDF generation libraries
- Financial calculation modules 

### Notification Service (`notification-service/`)
Event-based notification system.

**Key Features:**
- Email notifications
- In-app messaging
- Webhook integrations
- Notification templates

**Tech Stack:**
- NestJS framework
- SMTP email service
- WebSocket support

### UI Application (`ui/`)
Next.js based frontend application.

**Key Features:**
- Dashboard with analytics
- Timesheet entry interface
- Project management views
- Admin configuration

**Tech Stack:**
- Next.js framework
- React components
- Tailwind CSS
- Cypress/Jest testing

## Development Setup

### Prerequisites
- Docker 
- Node.js v18+
- npm v9+ 
- PostgreSQL (for local development)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd Nhom_01/02_Source
```

2. Setup environment variables:
```bash
cp .env.example .env
```

3. Start services:
```bash
docker-compose up -d
```

4. Install dependencies for each service:
```bash
cd invoice-service && npm install
cd ../notification-service && npm install
cd ../project-service && npm install
cd ../timesheet-service && npm install
cd ../ui && npm install
```

5. Run database migrations:
```bash
cd project-service
npx prisma migrate dev
```

### Running Services

**Development mode:**
```bash
npm run start:dev  # For each service
```

**Production mode:**
```bash
docker-compose up --build
```

**UI Development:**
```bash
cd ui
npm run dev
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License
This project is licensed under the MIT License.
