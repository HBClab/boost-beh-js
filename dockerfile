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

# Copy entrypoint script with Unix line endings
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN dos2unix /usr/local/bin/docker-entrypoint.sh && chmod +x /usr/local/bin/docker-entrypoint.sh

# port 3000
EXPOSE 3000

# Use bash explicitly to avoid shebang issues
ENTRYPOINT ["bash", "/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "react-start"]
