import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { AuthService } from 'src/auth/auth.service';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { DriversService } from 'src/drivers/drivers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { Vehicle } from 'src/vehicles/entities';
import { Driver } from 'src/drivers/entities';
import { Invitation, User } from 'src/auth/entities';
import { Route } from 'src/routes/entities';
import { RoutesService } from 'src/routes/routes.service';
import { AssignmentsModule } from 'src/assignments/assignments.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, DriversService, VehiclesService, AuthService, RoutesService,],
  imports: [
    TypeOrmModule.forFeature([ Vehicle, Driver, User, Route, Invitation]),
    CommonModule,
    AuthModule,
    AssignmentsModule
  ],
})
export class DashboardModule {}
