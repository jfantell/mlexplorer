# Dockerizing an angular application
# https://mherman.org/blog/dockerizing-an-angular-app/

FROM node:13.10.1

# # Create and define the node_modules's cache directory.
# RUN echo "Create and set working directory: /usr/src/cache"
# RUN mkdir /usr/src/cache
WORKDIR /app

RUN echo "Install angular dependencies"
RUN npm install -g @angular/cli
COPY package.json ./
RUN npm install

RUN echo "Install additional ubuntu packages"
RUN apt update
RUN apt install lsof

CMD npm start