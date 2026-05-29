FROM node:24-bookworm-slim

WORKDIR /app

COPY backend/package*.json ./backend/
RUN npm ci --prefix ./backend --omit=dev

COPY backend ./backend
COPY motorepuestos-app/src/data.js ./motorepuestos-app/src/data.js

ENV PORT=3000

EXPOSE 3000

CMD ["node", "backend/server.js"]
