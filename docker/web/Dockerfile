FROM ubuntu:14.04
MAINTAINER Josh Finnie <josh@jfin.us>

RUN apt-get -y update

# Basics
RUN apt-get install -y build-essential software-properties-common python-software-properties python g++ make wget

# Installing node.js
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get install -y nodejs 

# Running the app
CMD ["node", "/code/server.js"]
