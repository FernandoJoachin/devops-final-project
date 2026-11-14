import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities';
import { Repository } from 'typeorm';
import { ExceptionService } from 'src/common/exception.service';
import { winstonLogger } from 'src/common/utils/loggers';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly exceptionService: ExceptionService,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    try {
      winstonLogger.info(`[VehicleService] Creating new vehicle: ${JSON.stringify(createVehicleDto)}`);
      const vehicle = this.vehicleRepository.create(createVehicleDto);
      await this.vehicleRepository.save(vehicle);
      winstonLogger.info(`[VehicleService] Vehicle created with ID: ${vehicle.id}`);
      return vehicle;
    } catch (error) {
      winstonLogger.error(`[VehicleService] Error while creating vehicle: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      winstonLogger.debug('[VehicleService] Retrieving all vehicles');
      return this.vehicleRepository.find();
    } catch (error) {
      winstonLogger.error(`[VehicleService] Error while retrieving vehicles: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    winstonLogger.debug(`[VehicleService] Retrieving vehicle with ID: ${id}`);
    const vehicle = await this.vehicleRepository.findOneBy({ id });
    if (!vehicle) {
      winstonLogger.warn(`[VehicleService] Vehicle not found with ID: ${id}`);
      this.exceptionService.throwNotFound('Vehicle', id);
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    winstonLogger.debug(`[VehicleService] Updating vehicle with ID: ${id}`);
    const vehicle = await this.vehicleRepository.preload({
      id,
      ...updateVehicleDto,
    });

    if (!vehicle) {
      winstonLogger.warn(`[VehicleService] Vehicle not found for update with ID: ${id}`);
      this.exceptionService.throwNotFound('Vehicle', id);
    }

    try {
      const updated = await this.vehicleRepository.save(vehicle);
      winstonLogger.info(`[VehicleService] Vehicle updated with ID: ${updated.id}`);
      return updated;
    } catch (error) {
      winstonLogger.error(`[VehicleService] Error while updating vehicle: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      winstonLogger.debug(`[VehicleService] Deleting vehicle with ID: ${id}`);
      const vehicle = await this.findOne(id);
      await this.vehicleRepository.remove(vehicle);
      winstonLogger.info(`[VehicleService] Vehicle deleted with ID: ${id}`);
    } catch (error) {
      winstonLogger.error(`[VehicleService] Error while deleting vehicle: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }
}