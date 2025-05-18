export const ENV = {
  app_host: process.env.APP_HOST ?? 'localhost',
  app_port: process.env.APP_PORT ?? '3000',
  app_version: process.env.APP_VERSION ?? '1',

  database: {
    uri: process.env.DATABASE_URL,
  },

  internal_code: process.env.INTERNAL_CODE,

  timesheet_service: {
    url: process.env.TIMESHEET_SERVICE_URL,
  },

  rabbitmq: {
    url: process.env.RABBITMQ_URL,
  },
};
