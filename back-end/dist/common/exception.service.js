"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ExceptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionService = void 0;
const common_1 = require("@nestjs/common");
let ExceptionService = ExceptionService_1 = class ExceptionService {
    constructor() {
        this.logger = new common_1.Logger(ExceptionService_1.name);
    }
    handleDBExceptions(error) {
        if (error.code === '23505') {
            throw new common_1.BadRequestException(error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Unexpected error, check server logs');
    }
    throwNotFound(resource, id) {
        throw new common_1.NotFoundException(`${resource} with ID ${id} not found`);
    }
};
exports.ExceptionService = ExceptionService;
exports.ExceptionService = ExceptionService = ExceptionService_1 = __decorate([
    (0, common_1.Injectable)()
], ExceptionService);
//# sourceMappingURL=exception.service.js.map