import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities';
import { Repository } from 'typeorm';
import { ExceptionService } from 'src/common/exception.service';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly exceptionService: ExceptionService
  ){}
  
  async create(createDriverDto: CreateDriverDto) {
    try {
      const driver = this.driverRepository.create(createDriverDto);
      await this.driverRepository.save(driver);
      
      return driver;
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all drivers`;
  }

  findOne(id: string) {
    return `This action returns a #${id} driver`;
  }

  update(id: string, updateDriverDto: UpdateDriverDto) {
    return `This action updates a #${id} driver`;
  }

  remove(id: string) {
    return `This action removes a #${id} driver`;
  }
}
