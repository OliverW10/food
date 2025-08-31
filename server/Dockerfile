FROM node:24-alpine AS build

WORKDIR /app

COPY . .
RUN npm ci --only=production
RUN npm run generate
# RUN npx ncc build src/main.ts -o dist

# FROM node:24-alpine

# WORKDIR /app
# COPY . .
# COPY --from=build /app/dist .

EXPOSE 3000

CMD ["npx", "tsx", "src/main.ts"]
