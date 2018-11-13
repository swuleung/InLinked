"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../utils/lib/auth");
const config_1 = require("../config/config");
const middleware = require("../middleware");
class ExperienceController {
    constructor(experienceManager) {
        this.experienceManager = experienceManager;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    bindRoutes(app, module) {
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/experience`)
            .post(middleware.authentication(module.libs.auth), middleware.authorization([auth_1.Role.USER, auth_1.Role.ADMIN]), this.create.bind(this));
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/experience/:id`)
            .get(middleware.authentication(module.libs.auth), middleware.authorization([auth_1.Role.USER, auth_1.Role.ADMIN]), this.get.bind(this))
            .put(middleware.authentication(module.libs.auth), middleware.authorization([auth_1.Role.USER, auth_1.Role.ADMIN]), this.update.bind(this))
            .delete(middleware.authentication(module.libs.auth), middleware.authorization([auth_1.Role.USER, auth_1.Role.ADMIN]), this.delete.bind(this));
    }
}
exports.ExperienceController = ExperienceController;
//# sourceMappingURL=experience-controller.js.map