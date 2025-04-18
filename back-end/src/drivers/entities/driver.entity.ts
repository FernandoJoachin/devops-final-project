import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  birthdate: Date;

  @Column({ unique: true, length: 18 })
  curp: string;

  @Column()
  address: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monthlySalary: number;

  @Column({ unique: true })
  licenseNumber: string;

  @CreateDateColumn()
  entryDate: Date;

  @Column({ default: false })
  assigned: boolean;
}
