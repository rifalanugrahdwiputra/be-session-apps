import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CustomLoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();

    res.on('finish', () => {
      const elapsed = process.hrtime(start);
      const elapsedTimeInMilliseconds = elapsed[0] * 1000 + elapsed[1] / 1e6;
      const { method, originalUrl } = req;

      this.logger.log(
        `Session Apps - ${method} ${originalUrl} - ${elapsedTimeInMilliseconds.toFixed(
          2,
        )} ms `,
      );
    });

    next();
  }
}