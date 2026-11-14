import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces';
import { winstonLogger } from 'src/common/utils/loggers';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    winstonLogger.debug(`Validating JWT for user ID: ${id}`);

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      winstonLogger.warn(`JWT validation failed - user not found with ID: ${id}`);
      throw new UnauthorizedException('Token not valid');
    }

    winstonLogger.info(`JWT validated successfully for user ID: ${user.id}`);
    return user;
  }
}