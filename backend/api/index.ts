import { createApp } from '../src/main';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let handler: any = null;

export default async function (req: unknown, res: unknown) {
  if (!handler) {
    try {
      const app = await createApp();
      await app.init();
      handler = app.getHttpAdapter().getInstance();
    } catch (e) {
      (res as { status: (c: number) => { json: (d: unknown) => void } }).status(500).json({ error: 'Init failed: ' + String(e) });
      return;
    }
  }
  return handler(req, res);
}
