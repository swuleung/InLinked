/**
 * Controller for dealing with user accounts
 */
import { Application, NextFunction, Request, Response } from 'express';

import config from '../config/config';
import { UserManager } from '../managers';
import { User } from '../models';
import { IController } from './controller.interface';

export class UserController implements IController {

    private manager: UserManager;

    constructor(manager: UserManager) {
        this.manager = manager;
    }

    public create(req: Request, res: Response, next: NextFunction) {
        // const user: User = req.body; // Create a user from body

        res.json('Create hit!')
    }

    public get(req: Request, res: Response, next: NextFunction) {
        res.json('Get hit!');
    }

    public update(req: Request, res: Response, next: NextFunction) {
        res.json('Update hit!');
    }

    public delete(req: Request, res: Response, next: NextFunction) {
        res.json('Delete hit!');
    }

    /* Specific functions */
    public login(req: Request, res: Response, next: NextFunction) {
        
    }

    public changePassword(req: Request, res: Response, next: NextFunction) {

    } 

    /**
     * Bind the different functions to routes
     * @param app Express app to bind the routes to
     */
    public bindRoutes(app: Application): void {
        app.route(`/${config.app.api_route}/${config.app.api_ver}/user`)
            .post(this.add)
            .get(this.get);
        app.route(`/${config.app.api_route}/${config.app.api_ver}/:num`)
            .put(this.update)
            .delete(this.delete);

        app.route(`/${config.app.api_route}/${config.app.api_ver}/login`)
            .post(this.login);
        app.route(`/${config.app.api_route}/${config.app.api_ver}/changepass`)
            .post(this.changePassword);
    }
}