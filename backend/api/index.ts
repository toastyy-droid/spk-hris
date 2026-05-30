import { createApp } from '../src/main';

let handler: ((req: unknown, res: unknown) => void) | null = null;

export default async function (req: unknown, res: unknown) {
  if (!handler) {
    try {
      const app = await createApp();
      await app.init();
      handler = app.getHttpAdapter().getInstance();
    } catch (e) {
      console.error('NestJS init failed:', e);
      (res as { status: (c: number) => { json: (d: unknown) => void } }).status(500).json({ error: 'Init failed' });
      return;
    }
  }
  return handler(req, res);
}
