# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Install any dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript (if applicable)
RUN pnpm run build

# Define the command to run your app using CMD which defines your runtime
CMD ["pnpm", "run", "start"]
