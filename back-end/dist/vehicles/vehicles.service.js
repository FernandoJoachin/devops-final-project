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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const typeorm_2 = require("typeorm");
const exception_service_1 = require("../common/exception.service");
let VehiclesService = class VehiclesService {
    constructor(vehicleRepository, exceptionService) {
        this.vehicleRepository = vehicleRepository;
        this.exceptionService = exceptionService;
    }
    async create(createVehicleDto) {
        try {
            const vehicle = this.vehicleRepository.create(createVehicleDto);
            await this.vehicleRepository.save(vehicle);
            return vehicle;
        }
        catch (error) {
            this.exceptionService.handleDBExceptions(error);
        }
    }
    async findAll() {
        try {
            return this.vehicleRepository.find();
        }
        catch (error) {
            this.exceptionService.handleDBExceptions(error);
        }
    }
    findOne(id) {
        return `This action returns a #${id} vehicle`;
    }
    update(id, updateVehicleDto) {
        return `This action updates a #${id} vehicle`;
    }
    remove(id) {
        return `This action removes a #${id} vehicle`;
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        exception_service_1.ExceptionService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map