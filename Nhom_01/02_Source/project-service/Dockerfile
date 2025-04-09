# Use the official Node.js image as the base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code to the working directory
COPY . .

# Run Prisma commands to generate and migrate the database
RUN npm run prisma:generate
RUN npm run prisma:migrate

# Start the Nes.js application
CMD ["npm", "run", "start"]