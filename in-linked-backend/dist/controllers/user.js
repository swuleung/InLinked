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
const config_1 = require("../config/config");
class UserController {
    constructor(manager) {
        this.manager = manager;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // const user: User = req.body; // Create a user from body
            // const ret = await this.manager.create(user);
            // // res.json('Create hit! - ' + JSON.stringify(ret));
            // res.status(201).send({ ret });
            res.json('Create hit!');
        });
    }
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // const authUser: IUser = req.body; // Pass in attr for IUser in request body
            // const user = await this.manager.findByEmail(authUser.email);
            // res.status(200).send({ user }); // Return details for user
            res.json('Get hit!');
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // const newUserData: User = req.body.newUser;
            // const user = await this.manager.findByEmail(req.body.email);
            // // Update vars
            // user.coverPhoto = newUserData.coverPhoto;
            // user.headline = newUserData.headline;
            // user.profilePicture = newUserData.profilePicture;
            res.json('Update hit!');
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.manager.delete(req.body.id);// Delete the user by ID
            // res.status(204);
            res.json('Delete hit!');
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
            // const authToken: string = await this.manager.login(email, pass);
            res.send({ email, pass });
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
            yield this.manager.changePassword(email, newPass, oldPass);
            res.status(204); // Send no content
        });
    }
    /**
     * Bind the different functions to routes
     * @param app Express app to bind the routes to
     */
    bindRoutes(app) {
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/user`)
            .post(this.create.bind(this)) // Bind with this to provide contex to this curent object (user controller)
            .get(this.get.bind(this));
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/:num`)
            .put(this.update.bind(this))
            .delete(this.delete.bind(this));
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/login`)
            .post(this.login.bind(this));
        app.route(`/${config_1.default.app.api_route}/${config_1.default.app.api_ver}/changepass`)
            .post(this.changePassword.bind(this));
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.js.map