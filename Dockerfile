FROM node:20-alpine
RUN npm install -g pnpm@10
WORKDIR /app
RUN pnpm install
EXPOSE 3000
CMD ["pnpm", "run", "start:dev"]
