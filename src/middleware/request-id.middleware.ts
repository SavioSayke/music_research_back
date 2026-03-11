import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/node';

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = uuidv4();
  // attach to request object for downstream handlers
  (req as any).requestId = id;
  res.setHeader('x-request-id', id);

  // set Sentry scope tag and user ip
  try {
    (Sentry as any).configureScope((scope: any) => {
      scope.setTag('requestId', id);
      scope.setUser({ ip_address: req.ip });
    });
  } catch (e) {
    // ignore if Sentry not initialized
  }

  next();
}
