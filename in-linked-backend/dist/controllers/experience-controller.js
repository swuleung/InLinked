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
const experience_1 = require("../models/experience");
const exceptions_1 = require("../utils/exceptions");
const config_1 = require("../config/config");
const middleware = require("../middleware");
class ExperienceController {
    constructor(experienceManager) {
        this.experienceManager = experienceManager;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const experience = req.body;
            const ret = yield this.experienceManager.create(experience);
            // Failed to create, throw error
            if (exceptions_1.isError(ret)) {
                res.status(500).send(exceptions_1.buildErrorRes(ret));
                return;
            }
            res.status(201).send(ret);
        });
    }
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let experience = yield this.experienceManager.get(req.params.id);
            if (exceptions_1.isError(experience)) {
                res.status(500).send(exceptions_1.buildErrorRes(experience));
                return;
            }
            res.status(200).send(experience);
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const newExperienceData = req.body;
            const experience = yield this.experienceManager.get(newExperienceData.enterpriseId);
            // Update vars
            experience.enterpriseName = newExperienceData.enterpriseName;
            experience.positionName = newExperienceData.positionName;
            experience.description = newExperienceData.description;
            experience.startDate = newExperienceData.startDate;
            experience.location = newExperienceData.location;
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const experience = yield this.experienceManager.get(req.params.id);
            if (experience_1.isExperience(experience)) {
                yield this.experienceManager.delete(experience.experienceId);
            }
            res.status(204);
        });
    }
    /* Specific functions */
    getByUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let experience = yield this.experienceManager.get(req.params.id);
            if (exceptions_1.isError(experience[0])) {
                res.status(500).send(exceptions_1.buildErrorRes(experience[0]));
                return;
            }
            res.status(200).send(experience);
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