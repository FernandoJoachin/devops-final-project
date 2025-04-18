import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
export declare class DriversController {
    private readonly driversService;
    constructor(driversService: DriversService);
    create(createDriverDto: CreateDriverDto): Promise<import("./entities").Driver>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateDriverDto: UpdateDriverDto): string;
    remove(id: string): string;
}
