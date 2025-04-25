import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities';
import { Repository } from 'typeorm';
import { ExceptionService } from 'src/common/exception.service';
import { AssignmentsService } from 'src/assignments/assignments.service';

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

    const assignment = await this.assignmentsService.findOne(assignmentId);

    const existingRoute = await this.routeRepository.findOne({
      where: { assignment: { id: assignmentId }, routeDate: routeData.routeDate },
    });

    if (existingRoute)
      throw new ConflictException('A route already exists for this assignment on the specified date');

    try {
      const route = this.routeRepository.create({
        ...routeData, 
        assignment 
      });
      return this.routeRepository.save(route);
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all routes`;
  }

  findOne(id: string) {
    return `This action returns a #${id} route`;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    const route = await this.routeRepository.preload({
      id,
      ...updateRouteDto,
    });

    if (!route) this.exceptionService.throwNotFound("Route", id);

    try {
      return await this.routeRepository.save(route);
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }  
  
  remove(id: string) {
    return `This action removes a #${id} route`;
  }
}
