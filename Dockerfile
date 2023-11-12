FROM node:lts-slim

WORKDIR /app

COPY ./dist /app/dist
COPY ./package.json /app

# Add environment variables
ENV CLIENTID=
ENV CLIENTSECRET=
ENV CHAVE_API=
ENV URL_PANDA=https://api-v2.pandavideo.com.br
ENV URL_PANDA_UPLOAD=https://uploader-us01.pandavideo.com.br

RUN npm install

RUN mkdir /app/uploads

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
