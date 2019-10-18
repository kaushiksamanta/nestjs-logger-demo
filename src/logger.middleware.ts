import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from './custom.logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const { method, url, ip } = req;
    CustomLogger.log(
        `${ip} ${url} ${method} ${req.body}`,
        LoggerMiddleware.name,
    );
    next();
  }
}
