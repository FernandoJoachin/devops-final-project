import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { winstonLogger } from 'src/common/utils/loggers';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (err || !user) {
      const token = req.headers['authorization'] || 'no token provided';
      winstonLogger.warn(`JWT authentication failed. Token: ${token}, Reason: ${info?.message || err?.message}`);
      throw err || new UnauthorizedException('Invalid or missing token');
    }

    winstonLogger.debug(`User authenticated successfully via JWT: ${user.id}`);
    return user;
  }
}