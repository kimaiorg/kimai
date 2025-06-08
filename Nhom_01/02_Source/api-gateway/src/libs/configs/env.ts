export const ENV = {
  app_host: process.env.APP_HOST ?? 'localhost',
  app_port: process.env.APP_PORT ?? '3000',

  timesheet_service: {
    url: process.env.TIMESHEET_SERVICE_URL,
  },

  project_service: {
    url: process.env.PROJECT_SERVICE_URL,
  },

  notification_service: {
    url: process.env.NOTIFICATION_SERVICE_URL,
  },
};
