import type { Request, Response } from 'express';
import { createApp } from '../src/main';

let app: ReturnType<Express.Application>;

export default async function handler(req: Request, res: Response) {
  if (!app) {
    const nestApp = await createApp();
    await nestApp.init();
    app = nestApp.getHttpAdapter().getInstance();
  }
  return app(req, res);
}
