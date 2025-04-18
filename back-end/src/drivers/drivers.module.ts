import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { Driver } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [DriversController],
  providers: [DriversService],
  imports: [
    TypeOrmModule.forFeature([ Driver ]),
    CommonModule
  ],
})
export class DriversModule {}
