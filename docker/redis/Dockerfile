FROM ubuntu:14.04
MAINTAINER Josh Finnie <josh@jfin.us>

RUN apt-get -y update

# Basics
RUN apt-get install -y build-essential software-properties-common python-software-properties python g++ make wget curl

# Redis
ENV REDIS_VERSION 2.8.13

RUN wget http://download.redis.io/releases/redis-$REDIS_VERSION.tar.gz
RUN tar xvzf redis-$REDIS_VERSION.tar.gz
RUN cd redis-$REDIS_VERSION && make && make install
RUN cp redis-$REDIS_VERSION/src/redis-server redis-$REDIS_VERSION/src/redis-cli redis-$REDIS_VERSION/src/redis-benchmark /usr/local/bin

ADD config/redis.conf /etc/redis/redis.conf

# Define mountable directories.
VOLUME ["/data"]

# Define working directory.
WORKDIR /data

# Define default command.
CMD ["redis-server", "/etc/redis/redis.conf"]

# Expose ports.
EXPOSE 6378
