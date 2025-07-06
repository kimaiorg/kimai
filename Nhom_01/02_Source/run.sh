#!/bin/bash

echo "Start running containers..."
docker-compose up -d
if [ $? -ne 0 ]; then
  echo "Please run DOCKER please! I believe you are a CAREFUL CODER!."
  exit 1
fi

# === Project Service ===
echo "Starting Project Service..."
gnome-terminal -- bash -c "cd project-service && npm install && npm run prisma:generate && npm run prisma:migrate && npm run start"

echo "Starting Timesheet Service..."
gnome-terminal -- bash -c "cd timesheet-service && npm install && npm run prisma:generate && npm run prisma:migrate && npm run start"

echo "Starting Invoice Service..."
gnome-terminal -- bash -c "cd invoice-service && npm install -f && npm run prisma:generate && npm run prisma:migrate && npm run start"

echo "Starting Notification Service..."
gnome-terminal -- bash -c "cd notification-service && npm install && npm run prisma:generate && npm run prisma:migrate && npm run start"

echo "Starting Report Service..."
gnome-terminal -- bash -c "cd report-service && npm install -f && npm run start"

echo "Starting API Gateway..."
gnome-terminal -- bash -c "cd api-gateway && npm install && npm run start"

echo "All services started!"
