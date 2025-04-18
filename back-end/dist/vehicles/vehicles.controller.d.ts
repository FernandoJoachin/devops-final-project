import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(createVehicleDto: CreateVehicleDto): Promise<import("./entities").Vehicle>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateVehicleDto: UpdateVehicleDto): string;
    remove(id: string): string;
}
