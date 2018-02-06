# Base image
FROM debian:jessie

MAINTAINER Michael Pierce <hi@mep.im>

RUN apt-get update && \
    apt-get -y install curl python2.7 git make g++

RUN git clone https://github.com/tj/n && \
    cd n && \
    make install && \
    n 8.6.0

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --verbose
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

WORKDIR /src
ADD . /src

RUN mkdir /src/public/media

EXPOSE  4000

CMD ["npm", "start"]
