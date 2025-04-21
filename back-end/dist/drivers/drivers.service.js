"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriversService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const typeorm_2 = require("typeorm");
const exception_service_1 = require("../common/exception.service");
let DriversService = class DriversService {
    constructor(driverRepository, exceptionService) {
        this.driverRepository = driverRepository;
        this.exceptionService = exceptionService;
    }
    async create(createDriverDto) {
        try {
            const driver = this.driverRepository.create(createDriverDto);
            await this.driverRepository.save(driver);
            return driver;
        }
        catch (error) {
            this.exceptionService.handleDBExceptions(error);
        }
    }
    findAll() {
        try {
            return this.driverRepository.find();
        }
        catch (error) {
            this.exceptionService.handleDBExceptions(error);
        }
    }
    async findOne(id) {
        const driver = await this.driverRepository.findOneBy({ id });
        if (!driver)
            this.exceptionService.throwNotFound("Driver", id);
        return driver;
    }
    update(id, updateDriverDto) {
        return `This action updates a #${id} driver`;
    }
    remove(id) {
        return `This action removes a #${id} driver`;
    }
};
exports.DriversService = DriversService;
exports.DriversService = DriversService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Driver)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        exception_service_1.ExceptionService])
], DriversService);
//# sourceMappingURL=drivers.service.js.map