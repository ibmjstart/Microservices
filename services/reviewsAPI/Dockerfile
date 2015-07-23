FROM node

# Bundle app source
COPY . /src

# Install app dependencies
RUN cd /src; npm install

#export the mongo uri
ENV MONGO_URI mongodb://IbmCloud_...<rest of the URI> 

EXPOSE  8080
CMD ["node", "/src/reviewApi.js"]
