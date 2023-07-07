FROM --platform=linux/amd64 node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 5001

CMD [ "node", "src/index.js" ]
