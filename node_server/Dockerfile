FROM node:13.10.1

# Create and define the node_modules's cache directory.
RUN echo "Create and set working directory: /usr/src/cache"
RUN mkdir /usr/src/cache
WORKDIR /usr/src/cache

RUN echo "Install nodejs dependencies"
RUN npm install -g nodemon
COPY package.json ./
COPY package-lock.json ./
RUN npm install

RUN echo "Install additional ubuntu packages"
RUN apt update
RUN apt install lsof

# Create and define the application's working directory.
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# # Install node modules
# COPY package.json /node_server/
# RUN npm install
# COPY . /node_server

# Install lsof


# Bundle app code
# RUN echo "Copying files" 
# COPY . .

# Start angular cli
# RUN echo "Starting web server app"
# CMD bash -c "npm run start-dev"