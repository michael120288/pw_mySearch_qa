# Use the official Playwright image as the base
FROM mcr.microsoft.com/playwright:v1.38.0-focal

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies (Playwright and others)
RUN npm install --legacy-peer-deps

# Install Playwright dependencies
RUN npx playwright install --with-deps

# Copy the rest of the application code
COPY . .




