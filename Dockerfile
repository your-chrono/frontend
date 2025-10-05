FROM node:22.11.0-alpine AS builder

ARG COMMIT_HASH
ARG BRANCH_NAME

ENV COMMIT_HASH=${COMMIT_HASH}
ENV BRANCH_NAME=${BRANCH_NAME}

WORKDIR /home/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN echo "Building commit $COMMIT_HASH from branch $BRANCH_NAME"

RUN npm run build

FROM nginx:1.25.3-alpine

COPY --from=builder /home/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template


