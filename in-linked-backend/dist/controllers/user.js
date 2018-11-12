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
const models_1 = require("../models");
const auth_1 = require("../utils/lib/auth");
const exceptions_1 = require("../utils/exceptions");
const sanitize_1 = require("../utils/lib/sanitize");
const config_1 = require("../config/config");
const middleware = require("../middleware");
class UserController {
    constructor(userManager, candidateManager, enterpriseManager) {
        this.userManager = userManager;
        this.candidateManager = candidateManager;
        this.enterpriseManager = enterpriseManager;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body.user; // Create a user from body
            const ret = yield this.userManager.create(user);
            // Failed create, threw error cause of duplicate user
            if (exceptions_1.isError(ret)) {
                res.status(500).send(exceptions_1.buildErrorRes(ret));
            }
            // Create entries based on account type
            if (user.acctype === auth_1.AccType.ENTERPRISE) {
                yield this.enterpriseManager.create(req.body.enterprise);
            }
            else if (user.acctype === auth_1.AccType.CANDIDATE) {
                yield this.candidateManager.create(req.body.candidate);
            }
            res.status(201).send({ ret });
        });
    }
    // Gets generic info for user given an id
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userManager.get(req.params.id);
            // If response was an error, return it
            if (exceptions_1.isError(user)) {
                res.status(500).send(exceptions_1.buildErrorRes(user));
                return;
            }
            let special = null; // Store result for candidates/enterprise
            if (user.acctype === auth_1.AccType.ENTERPRISE) {
                special = yield this.enterpriseManager.get(user.userId);
            }
            else if (user.acctype === auth_1.AccType.CANDIDATE) {
                special = yield this.candidateManager.get(user.userId);
            }
            // Verify that responses for special objects succeeded
            user = models_1.isCandidate(special) || models_1.isEnterprise(special) ? sanitize_1.sanitizeUser(user) : null;
            res.status(200).send(Object.assign({}, user, special)); // Return details for user (with special data)
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUserData = req.body.user;
            const user = yield this.userManager.findByEmail(req.body.user.email);
            // Update vars
            user.coverPhoto = newUserData.coverPhoto;
            user.headline = newUserData.headline;
            user.profilePicture = newUserData.profilePicture;
            // TODO: Update candidate and enterprise
            if (user.acctype === auth_1.AccType.CANDIDATE) {
                const newCandData = req.body.candidate;
                const cand = yield this.candidateManager.get(user.userId);
                cand.fullName = newCandData.fullName;
                cand.skills = newCandData.skills;
                cand.experience = newCandData.experience;
                cand.educationLevel = newCandData.educationLevel;
                yield this.candidateManager.update(cand);
            }
            else if (user.acctype === auth_1.AccType.ENTERPRISE) {
                const newEnterpriseData = req.body.enterprise;
                const enterprise = yield this.enterpriseManager.get(user.userId);
                enterprise.enterpriseName = newEnterpriseData.enterpriseName;
                enterprise.enterpriseDescription = newEnterpriseData.enterpriseDescription;
                enterprise.ceo = newEnterpriseData.ceo;
                enterprise.headquarters = newEnterpriseData.headquarters;
                enterprise.industry = newEnterpriseData.industry;
                yield this.enterpriseManager.update(enterprise);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userManager.get(req.params.id);
            if (models_1.isUser(user)) { // Make sure it is not an error
                if (user.acctype === auth_1.AccType.CANDIDATE) {
                    yield this.candidateManager.delete(user.userId);
                }
                else if (user.acctype === auth_1.AccType.ENTERPRISE) {
                    yield this.enterpriseManager.delete(user.userId);
                }
                yield this.userManager.delete(req.params.id); // Delete the user by ID
            }
            res.status(204);
        });
    }
    /* Specific functions */
    /**
     * Forwards login requerst for the user and returns auth token
     *
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @memberof UserController
     */
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const pass = req.body.password;
            const authToken = yield this.userManager.login(email, pass);
            if (exceptions_1.isError(authToken)) {
                res.status(500).send(exceptions_1.buildErrorRes(authToken));
            }
            else {
                res.send({ authToken });
            }
        });
    }
    /**
     * Forwards request to update the password of the user
     *
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @memberof UserController
     */
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const oldPass = req.body.oldPassword;
            const newPass = req.body.newPassword;
            yield this.userManager.changePassword(email, newPass, oldPass);
            res.status(204); // Send no content
        });
    }
    /**
     * Bind the different functions to routes
     * @param app Express app to bind the routes to
     */
    bindRoutes(app, module) {
        // Bind with this to provide contex to this curent object (user controller)
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/user`)
            .post(middleware.authentication(module.libs.auth), middleware.authorization([auth_1.Role.USER, auth_1.Role.ADMIN]), this.create.bind(this));
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/user/:id`)
            .get(
        // middleware.authentication(module.libs.auth),
        this.get.bind(this))
            .put(middleware.authentication(module.libs.auth), middleware.authorization([auth_1.Role.USER, auth_1.Role.ADMIN]), this.update.bind(this))
            .delete(middleware.authentication(module.libs.auth), middleware.authorization([auth_1.Role.ADMIN]), this.delete.bind(this));
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/login`)
            .post(this.login.bind(this));
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/user/changepass`)
            .post(middleware.authentication(module.libs.auth), middleware.authorization([auth_1.Role.USER, auth_1.Role.ADMIN]), this.changePassword.bind(this));
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.js.map