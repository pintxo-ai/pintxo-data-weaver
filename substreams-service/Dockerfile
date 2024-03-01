# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

ENV SUBSTREAMS_API_KEY=459a63c9453779fdca0cd6a387196383ef686f15ee3dd52d
ENV MANIFEST_URL='https://github.com/pintxo-ai/pintxo-substreams/releases/download/v0.1.1/pintxo-stream-v0.1.0.spkg'

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
