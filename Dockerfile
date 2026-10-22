# ==========================================
# Stage 1: Build Frontend (Node.js Alpine)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Salin package files untuk memanfaatkan cache layer Docker
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin seluruh source code project
COPY . .

# Build aplikasi React Vite untuk production
RUN npm run build

# ==========================================
# Stage 2: Serve dengan Nginx Alpine
# ==========================================
FROM nginx:alpine

# Salin file konfigurasi kustom Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin output hasil build dari Stage 1 ke direktori root web Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port HTTP
EXPOSE 80

# Jalankan server Nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
