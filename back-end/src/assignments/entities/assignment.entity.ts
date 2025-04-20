import { Driver } from 'src/drivers/entities';
import { Vehicle } from 'src/vehicles/entities';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Driver, driver => driver.assignment)
  @JoinColumn()
  driver: Driver;
  
  @OneToOne(() => Vehicle, vehicle => vehicle.assignment)
  @JoinColumn()
  vehicle: Vehicle;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  assignmentDate: Date;
}
