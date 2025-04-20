import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment, AssignmentHistory } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { DriversService } from 'src/drivers/drivers.service';
import { ExceptionService } from 'src/common/exception.service';
import { Driver } from 'src/drivers/entities';
import { Vehicle } from 'src/vehicles/entities';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository : Repository<Assignment>,
    @InjectRepository(AssignmentHistory)
    private readonly assignmentHistoryRepository : Repository<AssignmentHistory>,
    private readonly dataSource : DataSource,

    private readonly vehicleService : VehiclesService,
    private readonly driverService : DriversService,
    private readonly exceptionService: ExceptionService
  ){}
  
  async create(createAssignmentDto: CreateAssignmentDto) {
    const { vehicleId, driverId } = createAssignmentDto;

    const assignedDriver = await this.driverService.findOne(driverId);
    if (assignedDriver.assigned) {
      this.exceptionService.throwConflictException("Driver", assignedDriver.id)
    }
    
    const assignedVehicle = await this.vehicleService.findOne(vehicleId);
    if (assignedVehicle.assigned) {
      this.exceptionService.throwConflictException("Vehicle", assignedVehicle.id)
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const assignment = this.assignmentRepository.create({
        driver: assignedDriver,
        vehicle: assignedVehicle
      });
      await queryRunner.manager.save(assignment)
      
      assignedDriver.assigned = true;
      await queryRunner.manager.save(Driver, assignedDriver);

      assignedVehicle.assigned = true;
      await queryRunner.manager.save(Vehicle, assignedVehicle);

      const assignmentHistory = this.assignmentHistoryRepository.create(
        {
          driver: assignedDriver,
          vehicle: assignedVehicle
        }
      )
      await queryRunner.manager.save(AssignmentHistory, assignmentHistory);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      
      return assignment;
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.exceptionService.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all assignments`;
  }

  findOne(id: string) {
    return `This action returns a #${id} assignment`;
  }

  update(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    return `This action updates a #${id} assignment`;
  }

  remove(id: string) {
    return `This action removes a #${id} assignment`;
  }
}
