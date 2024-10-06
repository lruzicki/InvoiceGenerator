# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the frontend
RUN npm run build

# Expose the frontend port
EXPOSE 3000

# Run the frontend application
CMD ["npm", "run", "start"]
