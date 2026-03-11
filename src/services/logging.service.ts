import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Injectable()
export class LoggingService {
  info(message: string, meta: Record<string, unknown> = {}) {
    this.output('info', message, meta);
  }

  warn(message: string, meta: Record<string, unknown> = {}) {
    this.output('warn', message, meta);
  }

  error(message: string, meta: Record<string, unknown> = {}) {
    this.output('error', message, meta);
    if (meta && meta.error instanceof Error) {
      try {
        Sentry.captureException(meta.error);
      } catch (e) {
        // ignore
      }
    }
  }

  private output(
    level: string,
    message: string,
    meta: Record<string, unknown>,
  ) {
    const ts = new Date().toISOString();
    const payload = { timestamp: ts, level, message, ...meta };
    // JSON structured logs to stdout
    console.log(JSON.stringify(payload));
  }
}
