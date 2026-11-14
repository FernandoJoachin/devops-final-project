import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { winstonLogger } from '../utils/loggers';
import { Response, Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const { method, url, body, query, params } = req;
    const env = process.env.NODE_ENV || 'development';

    const sanitizedBody = { ...body };
    if ('password' in sanitizedBody) {
      sanitizedBody.password = '[REDACTED]';
    }

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;

        winstonLogger.info({
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `[${method}] ${url} - ${res.statusCode} (${responseTime} ms)`,
          method,
          url,
          statusCode: res.statusCode,
          responseTime,
          userId: (req as any).user?.id || null,
          ...(env === 'development' && {
            query,
            params,
            body: sanitizedBody,
          }),
        });
      }),
      catchError((err) => {
        const responseTime = Date.now() - now;

        const statusCode = err?.status || res.statusCode || 500;

        winstonLogger.error({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: `[${method}] ${url} - ERROR ${statusCode} (${responseTime} ms)`,
          method,
          url,
          statusCode,
          responseTime,
          userId: (req as any).user?.id || null,
          errorMessage: err.message,
          stack: env === 'development' ? err.stack : undefined,
          ...(env === 'development' && {
            query,
            params,
            body: sanitizedBody,
          }),
        });

        return throwError(() => err);
      })

    );
  }
}