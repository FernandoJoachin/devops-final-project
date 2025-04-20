import { Driver } from "src/drivers/entities";
import { Vehicle } from "src/vehicles/entities";
import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class AssignmentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Driver)
  driver: Driver;

  @ManyToOne(() => Vehicle)
  vehicle: Vehicle;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  assignmentDate: Date;
}