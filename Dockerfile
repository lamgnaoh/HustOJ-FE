FROM node:16.20.2 AS builder

WORKDIR /HustOJ-FE
COPY package*.json /HustOJ-FE/
RUN rm -rf ./node_modules
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