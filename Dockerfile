FROM node:20-alpine
RUN npm install -g pnpm@10
WORKDIR /app
EXPOSE 3000
RUN pnpm install
CMD ["pnpm", "run", "start:dev"]
