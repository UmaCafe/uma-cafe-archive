FROM node:16 AS build
COPY . .
RUN npm install
RUN npm run build

FROM node:16-slim
COPY --from=build /content /content
COPY --from=build /build /app
COPY --from=build package.json package.json
COPY --from=build package-lock.json package-lock.json
RUN npm install --only=production
WORKDIR /app
EXPOSE 3000
CMD ["node", "."]