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
import { winstonLogger } from 'src/common/utils/loggers';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(AssignmentHistory)
    private readonly assignmentHistoryRepository: Repository<AssignmentHistory>,
    private readonly dataSource: DataSource,
    private readonly driversService: DriversService,
    private readonly vehiclesService: VehiclesService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto) {
    const { vehicleId, driverId } = createAssignmentDto;

    winstonLogger.info(`[AssignmentsService] Creating new assignment: driverId=${driverId}, vehicleId=${vehicleId}`);

    const assignedDriver = await this.driversService.findOne(driverId);
    if (assignedDriver.assigned) {
      winstonLogger.warn(`[AssignmentsService] Driver ${driverId} is already assigned`);
      this.exceptionService.throwConflictException('Driver', assignedDriver.id);
    }

    const assignedVehicle = await this.vehiclesService.findOne(vehicleId);
    if (assignedVehicle.assigned) {
      winstonLogger.warn(`[AssignmentsService] Vehicle ${vehicleId} is already assigned`);
      this.exceptionService.throwConflictException('Vehicle', assignedVehicle.id);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const assignment = this.assignmentRepository.create({
        driver: assignedDriver,
        vehicle: assignedVehicle,
      });
      await queryRunner.manager.save(assignment);

      assignedDriver.assigned = true;
      await queryRunner.manager.save(Driver, assignedDriver);

      assignedVehicle.assigned = true;
      await queryRunner.manager.save(Vehicle, assignedVehicle);

      const assignmentHistory = this.assignmentHistoryRepository.create({
        driver: assignedDriver,
        vehicle: assignedVehicle,
      });
      await queryRunner.manager.save(AssignmentHistory, assignmentHistory);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      winstonLogger.info(`[AssignmentsService] Assignment created with ID: ${assignment.id}`);
      return assignment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      winstonLogger.error(`[AssignmentsService] Error creating assignment: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      winstonLogger.debug(`[AssignmentsService] Retrieving all assignments`);
      const assignments = await this.assignmentRepository.find({
        relations: ['vehicle', 'driver'],
      });
      winstonLogger.debug(`[AssignmentsService] Retrieved ${assignments.length} assignments`);
      return assignments;
    } catch (error) {
      winstonLogger.error(`[AssignmentsService] Error retrieving assignments: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    winstonLogger.debug(`[AssignmentsService] Retrieving assignment with ID: ${id}`);
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['driver', 'vehicle'],
    });
    if (!assignment) {
      winstonLogger.warn(`[AssignmentsService] Assignment not found with ID: ${id}`);
      this.exceptionService.throwNotFound('Assignment', id);
    }

    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    winstonLogger.info(`[AssignmentsService] Updating assignment with ID: ${id}`);

    const { vehicleId, driverId, assignmentDate } = updateAssignmentDto;
    const existingAssignment = await this.findOne(id);

    if (driverId && driverId !== existingAssignment.driver.id) {
      const newDriver = await this.driversService.findOne(driverId);
      if (newDriver.assigned) {
        winstonLogger.warn(`[AssignmentsService] New driver ${driverId} is already assigned`);
        this.exceptionService.throwConflictException('Driver', newDriver.id);
      }
    }

    if (vehicleId && vehicleId !== existingAssignment.vehicle.id) {
      const newVehicle = await this.vehiclesService.findOne(vehicleId);
      if (newVehicle.assigned) {
        winstonLogger.warn(`[AssignmentsService] New vehicle ${vehicleId} is already assigned`);
        this.exceptionService.throwConflictException('Vehicle', newVehicle.id);
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (driverId && driverId !== existingAssignment.driver.id) {
        existingAssignment.driver.assigned = false;
        await queryRunner.manager.save(Driver, existingAssignment.driver);
      }

      if (vehicleId && vehicleId !== existingAssignment.vehicle.id) {
        existingAssignment.vehicle.assigned = false;
        await queryRunner.manager.save(Vehicle, existingAssignment.vehicle);
      }

      const newDriver = driverId ? await this.driversService.findOne(driverId) : existingAssignment.driver;
      const newVehicle = vehicleId ? await this.vehiclesService.findOne(vehicleId) : existingAssignment.vehicle;

      if (driverId && driverId !== existingAssignment.driver.id) {
        newDriver.assigned = true;
        await queryRunner.manager.save(Driver, newDriver);
      }

      if (vehicleId && vehicleId !== existingAssignment.vehicle.id) {
        newVehicle.assigned = true;
        await queryRunner.manager.save(Vehicle, newVehicle);
      }

      existingAssignment.driver = newDriver;
      existingAssignment.vehicle = newVehicle;
      if (assignmentDate) {
        existingAssignment.assignmentDate = assignmentDate;
      }
      await queryRunner.manager.save(existingAssignment);

      const assignmentHistory = this.assignmentHistoryRepository.create({
        driver: newDriver,
        vehicle: newVehicle,
      });
      await queryRunner.manager.save(AssignmentHistory, assignmentHistory);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      winstonLogger.info(`[AssignmentsService] Assignment updated with ID: ${existingAssignment.id}`);
      return existingAssignment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      winstonLogger.error(`[AssignmentsService] Error updating assignment: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    winstonLogger.debug(`[AssignmentsService] Removing assignment with ID: ${id}`);
    const assignment = await this.findOne(id);
    const driver = await this.driversService.findOne(assignment.driver.id);
    const vehicle = await this.vehiclesService.findOne(assignment.vehicle.id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      driver.assigned = false;
      await queryRunner.manager.save(Driver, driver);

      vehicle.assigned = false;
      await queryRunner.manager.save(Vehicle, vehicle);

      await this.assignmentRepository.remove(assignment);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      winstonLogger.info(`[AssignmentsService] Assignment deleted with ID: ${id}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      winstonLogger.error(`[AssignmentsService] Error deleting assignment: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }
}