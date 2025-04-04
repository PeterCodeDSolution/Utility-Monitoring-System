FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

ENV VITE_API_URL=http://localhost:5001/api

CMD ["npm", "run", "dev"] 