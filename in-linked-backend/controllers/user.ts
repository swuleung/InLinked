/**
 * Controller for dealing with user accounts
 */
import { Application, NextFunction, Request, Response } from 'express';

import config from '../config/config';
import { UserManager } from '../managers';
import { User } from '../models';
import { IUser } from '../utils/lib/auth';
import { IController } from './controller.interface';

export class UserController implements IController {

    private manager: UserManager;

    constructor(manager: UserManager) {
        this.manager = manager;
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        // const user: User = req.body; // Create a user from body
        // const ret = await this.manager.create(user);

        // // res.json('Create hit! - ' + JSON.stringify(ret));
        // res.status(201).send({ ret });

        res.json('Create hit!');
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        // const authUser: IUser = req.body; // Pass in attr for IUser in request body
        // const user = await this.manager.findByEmail(authUser.email);

        // res.status(200).send({ user }); // Return details for user

        res.json('Get hit!');
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        // const newUserData: User = req.body.newUser;
        // const user = await this.manager.findByEmail(req.body.email);

        // // Update vars
        // user.coverPhoto = newUserData.coverPhoto;
        // user.headline = newUserData.headline;
        // user.profilePicture = newUserData.profilePicture;

        res.json('Update hit!');
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        // await this.manager.delete(req.body.id);// Delete the user by ID
        // res.status(204);

        res.json('Delete hit!');
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
    public async login(req: Request, res: Response, next: NextFunction) {
        const email: string = req.body.email;
        const pass: string = req.body.password;
        // const authToken: string = await this.manager.login(email, pass);
        res.send({ email, pass });
    }

    /**
     * Forwards request to update the password of the user
     *
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @memberof UserController
     */
    public async changePassword(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;
        const oldPass = req.body.oldPassword;
        const newPass = req.body.newPassword;
        await this.manager.changePassword(email, newPass, oldPass);
        res.status(204); // Send no content
    } 

    /**
     * Bind the different functions to routes
     * @param app Express app to bind the routes to
     */
    public bindRoutes(app: Application): void {
        app.route(`/${config.app.api_route}/${config.app.api_ver}/user`)
            .post(this.create.bind(this)) // Bind with this to provide contex to this curent object (user controller)
            .get(this.get.bind(this));
        app.route(`/${config.app.api_route}/${config.app.api_ver}/:num`)
            .put(this.update.bind(this))
            .delete(this.delete.bind(this));

        app.route(`/${config.app.api_route}/${config.app.api_ver}/login`)
            .post(this.login.bind(this));
        app.route(`/${config.app.api_route}/${config.app.api_ver}/changepass`)
            .post(this.changePassword.bind(this));
    }
}