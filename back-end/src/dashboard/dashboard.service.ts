import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DriversService } from 'src/drivers/drivers.service';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { ExceptionService } from 'src/common/exception.service';
import { winstonLogger } from 'src/common/utils/loggers';
import { RoutesService } from 'src/routes/routes.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly authService: AuthService,
    private readonly driversService: DriversService,
    private readonly vehiclesService: VehiclesService,
    private readonly routesService: RoutesService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async getMetrics() {
    winstonLogger.debug('[DashboardService] Fetching dashboard metrics...');

    try {
      const [users, vehicles, drivers, routesToday] = await Promise.all([
        this.authService.findAll(),
        this.vehiclesService.findAll(),
        this.driversService.findAll(),
        this.routesService.findToday(),
      ]);

      const result = {
        users: users.length,
        vehicles: vehicles.length,
        drivers: drivers.length,
        routesToday: routesToday.length,
      };

      winstonLogger.info(`[DashboardService] Dashboard metrics: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      winstonLogger.error(`[DashboardService] Failed to fetch dashboard metrics: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }
}
