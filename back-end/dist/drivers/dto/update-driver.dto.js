"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDriverDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_driver_dto_1 = require("./create-driver.dto");
class UpdateDriverDto extends (0, mapped_types_1.PartialType)(create_driver_dto_1.CreateDriverDto) {
}
exports.UpdateDriverDto = UpdateDriverDto;
//# sourceMappingURL=update-driver.dto.js.map