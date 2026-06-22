FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG DIRECTUS_URL=https://cms.rotexai.com
ARG NEXT_PUBLIC_DIRECTUS_URL=https://cms.rotexai.com
ARG NEXT_PUBLIC_KEYCLOAK_URL=https://auth.rotexai.com/realms/internal
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=blog-web
ARG NEXT_PUBLIC_APP_URL=https://qvanle.rotexai.com
ENV DIRECTUS_URL=$DIRECTUS_URL
ENV NEXT_PUBLIC_DIRECTUS_URL=$NEXT_PUBLIC_DIRECTUS_URL
ENV NEXT_PUBLIC_KEYCLOAK_URL=$NEXT_PUBLIC_KEYCLOAK_URL
ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=$NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN npm run build

FROM node:20-slim AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone/app ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
