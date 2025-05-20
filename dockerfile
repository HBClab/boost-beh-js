# Use Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies first (for better caching)
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/ && npm install

# Copy source files
COPY . .

# Build the React (or other front-end) app
RUN npm run build

# Install serve to run the static site
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Serve the built app
CMD ["serve", "-s", "build", "-l", "3000"]
