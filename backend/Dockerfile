FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy TypeScript config and source
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Copy SQL files to dist (TypeScript doesn't copy them)
RUN cp -r src/db/*.sql dist/db/ 2>/dev/null || true

# Remove devDependencies after build
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/server.js"]

