# MartianTask
Delivery Price Calculator - PoC

## Usage
#### Install
`npm install`
#### Start
`npm start`

- Dev mode `npm run dev`
### Test
`npm test`
#### Docker compose
- Run `docker-compose -f docker-compose.yml up -d` to run postgres and redis as docker containers
- Uncomment **api** service in docker-compose.yml to run the API as a docker container

## Docs

`http://localhost:8000/api/docs`

## Dependencies

**bcryptjs** - password encryption

**config** - easier config handling and validation

**cookie-parser** - librariy for working with cookies

**dotenv** - load env variables

**envalid** - validate env variables

**express** - web framework

**helmet** - helps secure Express apps by setting HTTP response headers

**http-status-codes** - constants enumerating the HTTP status codes

**jsonwebtoken** - JWT authentication

**libphonenumber-js** - Phone number validation library

**nodemailer** - Email sending

**pg** - Postgres database

**pino** - Logger

**pino-http** - HTTP requests/responses logger

**pino-pretty** - pretty logging

**redis** - Redis library

**reflect-metadata** - Polyfill for Metadata Reflection API

**swagger-ui-express** - serve auto-generated swagger-ui generated API docs from express

**ts-openapi** - openapi json generator that helps to maintain API documentation

**typeorm** - Data-Mapper ORM for TypeScript

**zod** - TypeScript-first schema declaration and validation library with static type inference

#### Dev dependencies
**types** - various types for other dependencies

**jest** - unit testing framework

**pg-mem** - in-memory postgres db for testing

**prettier** - code formatter

**ts-jest** - typescript adaptation for jest

**ts-node** - TypeScript execution environment and REPL for node.js

**ts-node-dev** - compiles app and restarts when files are modified

**typescript** - Typescript

