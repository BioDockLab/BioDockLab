FROM node:22-alpine

WORKDIR /app

COPY . .

EXPOSE 5173

CMD ["node", "scripts/biodocklab_node_server.js"]