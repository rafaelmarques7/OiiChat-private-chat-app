# Dockerfile

# Node.js version
FROM --platform=linux/amd64 node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies in the local node_modules folder
RUN npm install --only=production

# Bundle app source
COPY . .

# Your app binds to port 5001 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 5001

# Define the command to run your app using CMD which defines your runtime
# CMD [ "npm", "run", "dev" ]
CMD [ "node", "index.js" ]
