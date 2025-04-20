import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities';
import { Repository } from 'typeorm';
import { ExceptionService } from 'src/common/exception.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly exceptionService: ExceptionService
  ){}
  
  async create(createVehicleDto: CreateVehicleDto) {
    try {
      const vehicle = this.vehicleRepository.create(createVehicleDto);
      await this.vehicleRepository.save(vehicle);
      
      return vehicle;
    } catch (error) {
      this.exceptionService.handleDBExceptions(error)
    }
  }

  findAll() {
    return `This action returns all vehicles`;
  }

  async findOne(id : string) {
    try {
      const vehicle = await this.vehicleRepository.findOneBy({ id });

      if(!vehicle) 
        throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);

      return vehicle; 
    } catch (error) {
      this.exceptionService.handleDBExceptions(error)
    }
  }

  update(id: string, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} vehicle`;
  }

  remove(id: string) {
    return `This action removes a #${id} vehicle`;
  }
}
