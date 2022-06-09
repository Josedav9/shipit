# build and config environment
FROM node:16-alpine
WORKDIR /app
COPY . .

# Install dependencies 
RUN npm install
RUN npm run build

EXPOSE 3000

# RUN
CMD [ "npm", "start" ]
