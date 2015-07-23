FROM node

# Bundle app source
COPY . /src

# Install app dependencies
RUN cd /src; npm install

#export the mongo uri
ENV MONGO_URI mongodb://IbmCloud_mcm25pjd_tvb7b3fc_nafd5b6a:oXSU-rYm_sgkdgxXGLpyomTgPMjNo2Cr@ds037802.mongolab.com:37802/IbmCloud_mcm25pjd_tvb7b3fc

EXPOSE  8080
CMD ["node", "/src/reviewApi.js"]
