import { Module } from '@nestjs/common';
import { ExceptionService } from './exception.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ExceptionService],
  exports: [ExceptionService]
})
export class CommonModule {}
