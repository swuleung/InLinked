/**
 * Main route files containing other routes/controllers
 */
import { Application } from 'express';

/* Import controllers */
import * as Controllers from '../controllers';

export class Routes {

    /* Controllers */
    public testController: Controllers.TestController;
    public userController: Controllers.UserController;
    
    constructor(app: Application) {
        this.testController = new Controllers.TestController();
        this.userController = new Controllers.UserController();

        // Bind routes
        this.testController.bindRoutes(app);
    }
}