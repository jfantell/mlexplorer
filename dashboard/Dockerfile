FROM node:13.10.1

# Create and define the node_modules's cache directory.
RUN echo "Create and set working directory: /usr/src/cache"
RUN mkdir /usr/src/cache
WORKDIR /usr/src/cache

RUN echo "Install angular dependencies"
RUN npm install -g @angular/cli
COPY package.json ./
COPY package-lock.json ./
RUN npm install

RUN echo "Install additional ubuntu packages"
RUN apt update
RUN apt install lsof

# Create and define the application's working directory.
RUN mkdir /usr/src/app
WORKDIR /usr/src/app