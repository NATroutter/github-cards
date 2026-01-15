FROM node:18-alpine AS base

#Installing needed packages
RUN apk add --no-cache libc6-compat wget

#Set application directory
WORKDIR /app

#Copy the project files
COPY . .

#Install dependencies
RUN npm ci

#Set envieroment variables
ENV NODE_ENV=production

# Expose the port where app runs
EXPOSE 9000

# Command to run the application
CMD ["node", "express.js"]