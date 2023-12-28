FROM node:9.11.1-alpine AS builder

WORKDIR /HustOJ-FE
COPY package*.json /HustOJ-FE/
RUN apk update && apk upgrade && apk add --no-cache git
RUN npm install

COPY . /HustOJ-FE/
RUN npm run build

# production stage
FROM nginx:1.23-alpine
RUN rm -rf /var/www/html/*
COPY nginx_config/nginx.conf /etc/nginx/nginx.conf
COPY nginx_config/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /HustOJ-FE/dist /var/www/html
RUN chown nginx:nginx /var/www/html

CMD ["nginx", "-g", "daemon off;"]