FROM node:18-alpine
LABEL authors="The Best CSC 4610 Group"
LABEL version="v0.0.3"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY backend/package*.json ./

RUN npm install
# If building for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

# API ports
EXPOSE 3000

# How Docker should start the server
CMD [ "node", "app.js" ]

# Check that the API is running
HEALTHCHECK --interval=300s --timeout=30s --start-period=5s --retries=3 CMD wget http://localhost:3000/health -q -O - > /dev/null 2>&1