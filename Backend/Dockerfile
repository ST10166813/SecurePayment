# Use Node.js LTS
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy project files
COPY . .

# Expose your backend port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
