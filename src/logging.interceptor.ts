import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { CustomLogger } from './custom.logger';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        call$: CallHandler,
    ): Observable<any> {
        const now = Date.now();
        const req = context.switchToHttp().getRequest<Request>();
        const { method, url, ip } = req;
        const userAgent = req.headers['user-agent'];
        CustomLogger.log(
            `[REQUEST] ${ip} ${method} ${url} ${userAgent}`,
            context.getClass().name,
        );

        // return call$.handle();
        return call$.handle().pipe(
            tap(() =>
            CustomLogger.log(
                    `[RESPONSE] ${method} ${url} ${method} ${Date.now() - now}ms`,
                    context.getClass().name,
                ),
            ),
        );
    }
}
