FROM node:16 AS build
COPY . .
RUN npm install
RUN npm run build

FROM node:16-slim
COPY --from=build /build /app
COPY --from=build package.json package.json
COPY --from=build package-lock.json package-lock.json
RUN npm install --only=production

WORKDIR /app

COPY --from=build gcloud_credentials.json gcloud_credentials.json
COPY --from=build s3_credentials.json s3_credentials.json
ENV GOOGLE_APPLICATION_CREDENTIALS=gcloud_credentials.json

EXPOSE 3000
CMD ["node", "."]