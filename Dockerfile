FROM node

# Bundle app source
COPY ./models /src/models
COPY ./public /src/public
COPY ./app.js /src/app.js
COPY ./faker.js /src/faker.js
COPY ./package.json /src/package.json

# Install app dependencies
RUN cd /src; npm install

#export the mongo uri 
ENV MONGO_URI mongodb://IbmCloud_mcm25pjd_tvb7b3fc_nafd5b6a:oXSU-rYm_sgkdgxXGLpyomTgPMjNo2Cr@ds037802.mongolab.com:37802/IbmCloud_mcm25pjd_tvb7b3fc

EXPOSE  8080
CMD ["node", "/src/app.js"]
