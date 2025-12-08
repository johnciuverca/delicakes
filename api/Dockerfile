# Use official Node.js image as base
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app


# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src

# Expose port (adjust if needed)
EXPOSE 3000

# Start the API server
CMD ["npm", "run", "start"]
