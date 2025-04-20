# 1. Use official Node image
FROM node:18

# 2. Set container’s working directory (virtual, inside Docker)
WORKDIR /usr/src/app

# 3. Copy dependencies config and install
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your server code
COPY . .

# 5. Expose the port your Express app listens on
EXPOSE 5000

# 6. Start your app
CMD ["node", "server.js"]
