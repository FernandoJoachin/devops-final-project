import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities';
import { Repository } from 'typeorm';
import { ExceptionService } from 'src/common/exception.service';
export declare class VehiclesService {
    private readonly vehicleRepository;
    private readonly exceptionService;
    constructor(vehicleRepository: Repository<Vehicle>, exceptionService: ExceptionService);
    create(createVehicleDto: CreateVehicleDto): Promise<Vehicle>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle>;
    remove(id: string): string;
}
