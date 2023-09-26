FROM node:18

COPY . .
RUN npm i -g npm && npm i

EXPOSE 8000
CMD ["npm", "start"]
