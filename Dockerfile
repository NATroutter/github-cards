FROM node:24-alpine AS base

#Installing needed packages
RUN apk add --no-cache libc6-compat wget

#Enable pnpm (version comes from packageManager in package.json)
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN npm install --global corepack@latest && corepack enable pnpm

#Set application directory
WORKDIR /app

#Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

#Copy the project files
COPY . .

#Set envieroment variables
ENV NODE_ENV=production

# Expose the port where app runs
EXPOSE 9000

# Command to run the application
CMD ["node", "express.js"]
