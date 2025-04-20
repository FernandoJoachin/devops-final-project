import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { Assignment, AssignmentHistory } from './entities';
import { Driver } from 'src/drivers/entities';
import { Vehicle } from 'src/vehicles/entities';

@Module({
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  imports: [
    TypeOrmModule.forFeature([ Assignment, AssignmentHistory, Vehicle, Driver ]),
    CommonModule
  ],
})
export class AssignmentsModule {}
