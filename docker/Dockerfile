FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG DIRECTUS_URL=https://cms.rotexai.com
ENV DIRECTUS_URL=$DIRECTUS_URL
RUN npm run build

FROM node:20-slim AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone/qvanle ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
