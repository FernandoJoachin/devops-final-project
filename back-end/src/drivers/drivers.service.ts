import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities';
import { Repository } from 'typeorm';
import { ExceptionService } from 'src/common/exception.service';
import { winstonLogger } from 'src/common/utils/loggers';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly exceptionService: ExceptionService
  ) {}

  async create(createDriverDto: CreateDriverDto) {
    try {
      winstonLogger.info(`[DriversService] Creating new driver: ${JSON.stringify(createDriverDto)}`);
      const driver = this.driverRepository.create(createDriverDto);
      await this.driverRepository.save(driver);
      winstonLogger.info(`[DriversService] Driver created with ID: ${driver.id}`);
      return driver;
    } catch (error) {
      winstonLogger.error(`[DriversService] Error while creating driver: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      winstonLogger.debug(`[DriversService] Retrieving all drivers`);
      const drivers = await this.driverRepository.find();
      winstonLogger.debug(`[DriversService] Retrieved ${drivers.length} drivers`);
      return drivers;
    } catch (error) {
      winstonLogger.error(`[DriversService] Error while retrieving drivers: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    winstonLogger.debug(`[DriversService] Retrieving driver with ID: ${id}`);
    const driver = await this.driverRepository.findOneBy({ id });
    if (!driver) {
      winstonLogger.warn(`[DriversService] Driver not found with ID: ${id}`);
      this.exceptionService.throwNotFound('Driver', id);
    }
    return driver;
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    winstonLogger.debug(`[DriversService] Updating driver with ID: ${id}`);
    const driver = await this.driverRepository.preload({
      id,
      ...updateDriverDto,
    });

    if (!driver) {
      winstonLogger.warn(`[DriversService] Driver not found for update with ID: ${id}`);
      this.exceptionService.throwNotFound('Driver', id);
    }

    try {
      const updated = await this.driverRepository.save(driver);
      winstonLogger.info(`[DriversService] Driver updated with ID: ${updated.id}`);
      return updated;
    } catch (error) {
      winstonLogger.error(`[DriversService] Error while updating driver: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      winstonLogger.debug(`[DriversService] Deleting driver with ID: ${id}`);
      const driver = await this.findOne(id);
      await this.driverRepository.remove(driver);
      winstonLogger.info(`[DriversService] Driver deleted with ID: ${id}`);
    } catch (error) {
      winstonLogger.error(`[DriversService] Error while deleting driver: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }
}