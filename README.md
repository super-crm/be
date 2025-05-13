# Super CRM BE

## Getting started

Before running BE make sure you created `.env` file and filled it with all needed values. Some of them are prefilled in `.env.example` file but you will need to set correct value for `GITHUB_API_TOKEN` https://github.com/settings/tokens

## Running locally

```bash
# 1. install dependencies
$ npm i

# 2. generate prisma client
$ npm run prisma:generate

# 3. start db
$ docker-compose up -d

# 4. start server
$ npm run start
```

## Swagger URL
http://localhost:3000/api/
