FROM node:alpine
RUN mkdir -p /usr/src/app
# set working directory
WORKDIR /usr/src/app
# install and cache app dependencies
COPY . .
RUN npm install
RUN npm install react react-scripts react-dom react-router-dom reactstrap react-select axios bootstrap
RUN npm run build

# start app
CMD [ "npm", "run dev" ]