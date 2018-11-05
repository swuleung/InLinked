/**
 * Test controller
 * PLEASE TEST ME
 */

import { Application, NextFunction, Request, Response } from 'express';
import { IController } from './controller.interface';

/* Import services being used */

export class TestController implements IController {

    public add(req: Request, res: Response, next: NextFunction) {
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

    /**
     * Bind the different functions to routes
     * @param app Express app to bind the routes to
     */
    public bindRoutes(app: Application): void {
        app.route('/test')
            .post(this.add.bind(this))
            .get(this.get.bind(this));
        app.route('/test/:num')
            .put(this.update.bind(this))
            .delete(this.delete.bind(this));
    }
}