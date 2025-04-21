import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(createVehicleDto: CreateVehicleDto): Promise<import("./entities").Vehicle>;
    findAll(): Promise<import("./entities").Vehicle[]>;
    findOne(id: string): Promise<import("./entities").Vehicle>;
    update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<import("./entities").Vehicle>;
    remove(id: string): Promise<void>;
}
