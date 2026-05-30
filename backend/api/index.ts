import serverlessExpress from '@codegenie/serverless-express';
import { createApp } from '../src/main';

let cachedServer: ReturnType<typeof serverlessExpress>;

export const handler = async (...args: unknown[]) => {
  if (!cachedServer) {
    const app = await createApp();
    cachedServer = serverlessExpress({ app: app.getHttpAdapter().getInstance() });
  }
  return cachedServer(args[0], args[1], args[2]);
};
