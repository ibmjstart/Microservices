FROM node

# Bundle app source
COPY ./bower_components /src/bower_components
COPY ./models /src/models
COPY ./public /src/public
COPY ./bower_components /src/bower_components
COPY ./app.js /src/app.js
COPY ./faker.js /src/faker.js
COPY ./package.json /src/package.json

# Install app dependencies
RUN cd /src; npm install

#export the mongo uri 
ENV MONGO_URI mongodb://IbmCloud_...<rest of the URI>

EXPOSE  8080
CMD ["node", "/src/app.js"]
