import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities';
import { Repository } from 'typeorm';
import { ExceptionService } from 'src/common/exception.service';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { winstonLogger } from 'src/common/utils/loggers';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    private readonly assignmentsService: AssignmentsService,
    private readonly exceptionService: ExceptionService
  ) {}

  async create(createRouteDto: CreateRouteDto) {
    const { assignmentId, ...routeData } = createRouteDto;

    winstonLogger.info(`[RoutesService] Creating route for assignment ID: ${assignmentId} on date: ${routeData.routeDate}`);

    const assignment = await this.assignmentsService.findOne(assignmentId);

    const existingRoute = await this.routeRepository.findOne({
      where: { assignment: { id: assignmentId }, routeDate: routeData.routeDate },
    });

    if (existingRoute) {
      winstonLogger.warn(`[RoutesService] Route already exists for assignment ID ${assignmentId} on ${routeData.routeDate}`);
      throw new ConflictException('A route already exists for this assignment on the specified date');
    }

    try {
      const route = this.routeRepository.create({
        ...routeData,
        assignment,
      });
      const saved = await this.routeRepository.save(route);
      winstonLogger.info(`[RoutesService] Route created with ID: ${saved.id}`);
      return saved;
    } catch (error) {
      winstonLogger.error(`[RoutesService] Error while creating route: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      winstonLogger.debug(`[RoutesService] Retrieving all routes`);
      const routes = await this.routeRepository.find({
        relations: ['assignment', 'assignment.vehicle', 'assignment.driver'],
      });
      winstonLogger.debug(`[RoutesService] Retrieved ${routes.length} routes`);
      return routes;
    } catch (error) {
      winstonLogger.error(`[RoutesService] Error while retrieving routes: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    winstonLogger.debug(`[RoutesService] Retrieving route with ID: ${id}`);
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: ['assignment', 'assignment.vehicle', 'assignment.driver'],
    });

    if (!route) {
      winstonLogger.warn(`[RoutesService] Route not found with ID: ${id}`);
      this.exceptionService.throwNotFound('Route', id);
    }

    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    winstonLogger.debug(`[RoutesService] Updating route with ID: ${id}`);

    if (updateRouteDto.assignmentId) {
      winstonLogger.debug(`[RoutesService] Validating new assignment ID: ${updateRouteDto.assignmentId}`);
      await this.assignmentsService.findOne(updateRouteDto.assignmentId);
    }

    const route = await this.routeRepository.preload({
      id,
      ...updateRouteDto,
    });

    if (!route) {
      winstonLogger.warn(`[RoutesService] Route not found for update with ID: ${id}`);
      this.exceptionService.throwNotFound('Route', id);
    }

    try {
      const updated = await this.routeRepository.save(route);
      winstonLogger.info(`[RoutesService] Route updated with ID: ${updated.id}`);
      return updated;
    } catch (error) {
      winstonLogger.error(`[RoutesService] Error while updating route: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    winstonLogger.debug(`[RoutesService] Deleting route with ID: ${id}`);
    const route = await this.findOne(id);
    await this.routeRepository.remove(route);
    winstonLogger.info(`[RoutesService] Route deleted with ID: ${id}`);
  }
}