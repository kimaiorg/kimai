@echo off

echo Start running containers...
docker-compose up -d

IF ERRORLEVEL 1 (
    echo Please run DOCKER please!. I believe you are a CAREFUL CODER!.
    exit /b 1
)

REM ==== Project Service ====  
echo Starting Project Service... 
start "Project Service" cmd /c "cd project-service && npm install && npm run prisma:generate && npm run prisma:migrate && npm run start"
start "Timesheet Service" cmd /c "cd timesheet-service && npm install && npm run prisma:generate && npm run prisma:migrate && npm run start"
start "Invoice Service" cmd /c "cd invoice-service && npm install -f && npm run prisma:generate && npm run prisma:migrate && npm run start"
start "Notification Service" cmd /c "cd notification-service && npm install && npm run prisma:generate && npm run prisma:migrate && npm run start"  
start "Report Service" cmd /c "cd report-service && npm install -f && npm run start"  
start "API Gateway" cmd /c "cd api-gateway && npm install && npm run start"    
echo All services started! 

