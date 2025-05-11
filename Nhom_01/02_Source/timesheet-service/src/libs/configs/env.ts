export const ENV = {
  app_host: process.env.APP_HOST ?? 'localhost',
  app_port: process.env.APP_PORT ?? '3000',
  app_version: process.env.APP_VERSION ?? '1',

  internal_code: process.env.INTERNAL_CODE,

  database: {
    uri: process.env.DATABASE_URL,
  },

  rabbitmq: {
    url: process.env.RABBITMQ_URL,
  },
};
