FROM node

RUN mkdir -p /usr/vue/app
WORKDIR /usr/vue/app

COPY . /usr/vue/app

RUN yarn install
RUN yarn global add http-server
RUN yarn build

EXPOSE 8080

CMD ["http-server", "dist"]
