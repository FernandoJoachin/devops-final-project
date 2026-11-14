import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { winstonLogger } from 'src/common/utils/loggers';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = typeof req.headers['authorization'] === 'string'
      ? req.headers['authorization']
      : 'no token provided';

    if (err || !user) {
      winstonLogger.error({
        timestamp: new Date().toISOString(),
        level: 'error',
        method: req.method,
        url: req.url,
        token,
        reason: info?.message || err?.message || 'Unknown error',
        message: 'JWT authentication failed',
        statusCode: 401, 
      });

      throw err || new UnauthorizedException('Invalid or missing token');
    }

    winstonLogger.debug({
      timestamp: new Date().toISOString(),
      level: 'debug',
      message: `User authenticated successfully via JWT`,
      userId: user.id,
      method: req.method,
      url: req.url,
    });

    return user;
  }
}