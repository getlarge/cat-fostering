FROM nginx:1.21.4-alpine
ARG APP_NAME=cat-fostering-web

RUN adduser -D -g 'www' www

COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=www:www ./dist/apps/${APP_NAME} /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
