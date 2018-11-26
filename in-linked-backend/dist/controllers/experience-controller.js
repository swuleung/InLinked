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
const controller_abstract_1 = require("./controller.abstract");
const auth_1 = require("../utils/lib/auth");
const exceptions_1 = require("../utils/exceptions");
const config_1 = require("../config/config");
const middleware = require("../middleware");
class ExperienceController extends controller_abstract_1.IController {
    constructor(experienceManager) {
        super();
        this.experienceManager = experienceManager;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const experience = req.body.experience;
                const ret = yield this.experienceManager.create(experience);
                res.status(201).send(this.buildSuccessRes(`Successfully created experience for user id '${experience.candidateId}' with experience id '${experience.experienceId}'.`, ret));
            }
            catch (ex) {
                res.status(500).send(this.buildErrorRes(exceptions_1.isError(ex) ? ex.toObject() : { message: ex.message }));
            }
        });
    }
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const experience = yield this.experienceManager.get(req.params.id);
                res.status(200).send(this.buildSuccessRes(`Successfully fetched experience with id '${req.params.id}'.`, experience));
            }
            catch (ex) {
                res.status(500).send(this.buildErrorRes(exceptions_1.isError(ex) ? ex.toObject() : { message: ex.message }));
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newExperienceData = req.body.experience;
                const experience = yield this.experienceManager.get(req.params.id);
                // Update vars
                experience.enterpriseId = newExperienceData.enterpriseId; // Allow nulls
                experience.enterpriseName = newExperienceData.enterpriseName;
                experience.positionName = newExperienceData.positionName;
                experience.description = newExperienceData.description || experience.description;
                experience.startMonth = newExperienceData.startMonth,
                    experience.startYear = newExperienceData.startYear,
                    experience.endMonth = newExperienceData.endMonth, // Allow nulls
                    experience.endYear = newExperienceData.endYear, // Allow nulls
                    experience.location = newExperienceData.location || experience.location;
                yield this.experienceManager.update(experience);
                res.status(200).send(this.buildSuccessRes(`Experience id: ${experience.experienceId} successfully updated.`));
            }
            catch (ex) {
                res.status(500).send(this.buildErrorRes(exceptions_1.isError(ex) ? ex.toObject() : { message: ex.message }));
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const experience = yield this.experienceManager.get(req.params.id);
                yield this.experienceManager.delete(experience.experienceId);
                res.status(204).send(this.buildSuccessRes(`Successfully deleted experience id ${experience.experienceId} for user id ${experience.candidateId}.`));
            }
            catch (ex) {
                res.status(500).send(this.buildErrorRes(exceptions_1.isError(ex) ? ex.toObject() : { message: ex.message }));
            }
        });
    }
    /* Specific functions */
    getByUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const experience = yield this.experienceManager.getByUser(req.params.candidateId);
                res.status(200).send(this.buildSuccessRes(`Successfully fetched experiences for user id '${req.params.candidateId}' experience`, experience));
            }
            catch (ex) {
                res.status(500).send(this.buildErrorRes(exceptions_1.isError(ex) ? ex.toObject() : { message: ex.message }));
            }
        });
    }
    bindRoutes(app, module) {
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/experience`)
            .post(middleware.authentication(module.libs.auth), middleware.authorization([auth_1.Role.USER, auth_1.Role.ADMIN]), this.create.bind(this));
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/experience/:id`)
            .get(middleware.authentication(module.libs.auth), this.get.bind(this))
            .put(middleware.authentication(module.libs.auth), middleware.authorization([auth_1.Role.USER, auth_1.Role.ADMIN]), this.update.bind(this))
            .delete(middleware.authentication(module.libs.auth), this.delete.bind(this));
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/experience/user/:candidateId`)
            .post(middleware.authentication(module.libs.auth), middleware.authorization([auth_1.Role.USER, auth_1.Role.ADMIN]), this.getByUser.bind(this));
    }
}
exports.ExperienceController = ExperienceController;
//# sourceMappingURL=experience-controller.js.map