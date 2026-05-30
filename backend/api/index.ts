import type { Request, Response } from 'express';
import serverlessExpress from '@codegenie/serverless-express';
import { createApp } from '../src/main';

let cachedServer: ReturnType<typeof serverlessExpress>;

export const handler = async (event: Request, context: unknown, callback: unknown) => {
  if (!cachedServer) {
    const app = await createApp();
    await app.init();
    cachedServer = serverlessExpress({ app: app.getHttpAdapter().getInstance() });
  }
  return cachedServer(event, context, callback);
};
