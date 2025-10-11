# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies using lockfile for reproducible builds
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

ENV PORT=3000
ENV IP=0.0.0.0
# Expose HTTPS app port and HTTP redirect port
EXPOSE 3000 80



# Set environment variables file (optional)
# COPY example.env .env

# Optional: disable redirect by setting ENABLE_HTTP_REDIRECT=false
ENV ENABLE_HTTP_REDIRECT=true

# Start the application
CMD ["node", "server.js"]