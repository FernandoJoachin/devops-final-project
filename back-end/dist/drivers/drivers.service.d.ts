import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities';
import { Repository } from 'typeorm';
import { ExceptionService } from 'src/common/exception.service';
export declare class DriversService {
    private readonly driverRepository;
    private readonly exceptionService;
    constructor(driverRepository: Repository<Driver>, exceptionService: ExceptionService);
    create(createDriverDto: CreateDriverDto): Promise<Driver>;
    findAll(): Promise<Driver[]>;
    findOne(id: string): Promise<Driver>;
    update(id: string, updateDriverDto: UpdateDriverDto): string;
    remove(id: string): string;
}
