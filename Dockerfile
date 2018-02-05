# Base image
FROM debian:jessie

MAINTAINER Michael Pierce <hi@mep.im>

# Install Node.js Dependencies
RUN apt-get update && \
    apt-get -y install curl python2.7 git make g++

RUN git clone https://github.com/tj/n && \
    cd n && \
    make install && \
    n 8.6.0

# Install nodemon
RUN npm install -g pm2

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --verbose
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Define working directory
WORKDIR /src
ADD . /src

# Expose port
EXPOSE  4000

# Run app using pm2

RUN /src/node_modules/gulp/bin/gulp.js prod
CMD ["npm", "start"]
