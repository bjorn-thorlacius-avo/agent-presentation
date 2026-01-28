import { RequestHandler } from 'express';

export const requestLogger = (): RequestHandler => {
  return (req, _res, next) => {
    const startedAt = Date.now();
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    req.on('finish', () => {
      const durationMs = Date.now() - startedAt;
      console.log(`[${timestamp}] ${req.method} ${req.path} ${durationMs}ms`);
    });
    next();
  };
};
