import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    brand: string;
  
    @Column()
    model: string;
  
    @Column({ unique: true, length: 17 })
    vin: string;
  
    @Column({ unique: true })
    licensePlate: string;
  
    @Column()
    purchaseDate: Date;
  
    @Column('decimal', { precision: 10, scale: 2 })
    cost: number;
  
    @Column({ nullable: true })
    photo: string;
  
    @CreateDateColumn()
    entryDate: Date;
  
    @Column({ default: false })
    assigned: boolean;
}
