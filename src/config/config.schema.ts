import * as Joi from 'joi';

export const configSchema = Joi.object({
  ALLOWED_ORIGIN: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  GITHUB_API_BASE_URL: Joi.string().required(),
  GITHUB_API_TOKEN: Joi.string().required(),
  JWT_ACCESS_COOKIE_NAME: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_COOKIE_NAME: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  SERVER_PORT: Joi.number().default(3000),
});
