/**
 * Test controller
 * PLEASE TEST ME
 */

import { Request, Response, NextFunction, Application } from 'express';
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
    public bindRoute(app: Application): void {
        app.route('/test')
            .post(this.add)
            .get(this.get);
        app.route('/test/:num')
            .put(this.update)
            .delete(this.delete);
    }
}