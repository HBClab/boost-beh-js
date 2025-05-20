# Use Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy build files
RUN npm run build

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Serve build folder on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]
