import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { winstonLogger } from '../utils/loggers';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const { method, url, body, query, params } = req;
    if (process.env.NODE_ENV === 'development') {
        winstonLogger.debug(`[${method}] ${url} called`);
        winstonLogger.debug(`Payload: ${JSON.stringify(body)}`);
        winstonLogger.debug(`Query: ${JSON.stringify(query)}`);
        winstonLogger.debug(`Params: ${JSON.stringify(params)}`);
    }

    return next.handle().pipe(
      tap(() => {
        if (process.env.NODE_ENV === 'development') {
          winstonLogger.debug(`[${method}] ${url} completed`);
        }
      }),
    );
  }
}