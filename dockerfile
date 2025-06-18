# Use Node base image
FROM node:18-alpine

# Install dependencies (git needed for sparse checkout)
RUN apk add --no-cache git bash

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/ && npm install

# Copy all source code
COPY . .

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Use the entrypoint script to run sparse checkout before app launch
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "react-start"]
