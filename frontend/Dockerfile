FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Delete any Windows-generated lockfile and install fresh for Linux
RUN rm -f package-lock.json && npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]