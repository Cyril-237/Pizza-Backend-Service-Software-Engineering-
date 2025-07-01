# Use the official Node.js image as a base
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:latest

# Install additional packages if needed
RUN apt-get update && apt-get install -y \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /workspace

# Copy package.json and package-lock.json (if available)
COPY package*.json ./
COPY tsconfig.json ./

# Install project dependencies
# RUN npm install

# Copy the rest of your application code
# COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]