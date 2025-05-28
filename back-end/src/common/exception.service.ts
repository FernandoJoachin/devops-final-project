import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExceptionService {
  private readonly logger = new Logger(ExceptionService.name);

  constructor(private readonly configService: ConfigService) {}

  handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    const isDev = this.configService.get<string>('NODE_ENV') !== 'production';
    const message = isDev ? 'Unexpected error, check server logs' : 'Internal server error';
    throw new InternalServerErrorException(message);
  }

  throwNotFound(resource: string, id: string): never {
    throw new NotFoundException(`${resource} with ID ${id} not found`);
  }

  throwConflictException(resource: string, id: string){
    throw new ConflictException(`The ${resource} with ID ${id} has already been assigned`)
  }
}
