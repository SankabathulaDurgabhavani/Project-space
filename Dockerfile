# # --------- FRONTEND BUILD (Vite React) ---------
# FROM node:18 AS frontend

# WORKDIR /app
# COPY client/ ./client/
# WORKDIR /app/client

# RUN npm install
# RUN npm run build


# # --------- BACKEND + SERVE FRONTEND ---------
# FROM node:18

# WORKDIR /app

# # Copy backend files
# COPY server/ ./server/
# WORKDIR /app/server

# # Copy frontend build output into backend
# COPY --from=frontend /app/client/dist ./client/dist

# # Install backend dependencies
# RUN npm install

# # Expose the port
# EXPOSE 5000

# # Start the backend server
# WORKDIR /app/server
# CMD ["npm","start"]


# --------- FRONTEND BUILD (Vite React) ---------
FROM node:18 AS frontend

WORKDIR /app
COPY client/ ./client/
WORKDIR /app/client

RUN npm install
RUN npm run build

# --------- BACKEND + SERVE FRONTEND ---------
FROM node:18

WORKDIR /app

# Copy backend files
COPY server/ ./server/
WORKDIR /app/server

# ✅ COPY frontend build output into backend
COPY --from=frontend /app/client/dist ./client/dist

# Install backend dependencies
RUN npm install

EXPOSE 5000

CMD ["npm", "start"]

