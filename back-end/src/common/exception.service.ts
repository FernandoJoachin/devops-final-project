import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class ExceptionService {
  private readonly logger = new Logger(ExceptionService.name);

  handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  throwNotFound(resource: string, id: string): never {
    throw new NotFoundException(`${resource} with ID ${id} not found`);
  }
}
