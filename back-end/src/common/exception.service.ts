import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { winstonLogger } from 'src/common/utils/loggers';

@Injectable()
export class ExceptionService {
  constructor(
    private readonly configService: ConfigService
  ) {}

  handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    winstonLogger.error('Database exception', {
      error,
      context: 'handleDBExceptions',
    });

    const isDev = this.configService.get<string>('NODE_ENV') !== 'production';
    const message = isDev
      ? 'Unexpected error, check server logs'
      : 'Internal server error';
    throw new InternalServerErrorException(message);
  }

  throwNotFound(resource: string, id: string): never {
    throw new NotFoundException(`${resource} with ID ${id} not found`);
  }

  throwConflictException(resource: string, id: string): never {
    throw new ConflictException(
      `The ${resource} with ID ${id} has already been assigned`,
    );
  }
}