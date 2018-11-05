/**
 * Main route files containing other routes/controllers
 */
import { Application } from 'express';

/* Import controllers */
import * as Controllers from '../controllers';
import { ServiceModule } from '../utils/module/service-module';

export class Routes {

    /* Controllers */
    public testController: Controllers.TestController;
    public userController: Controllers.UserController;
    
    constructor(app: Application, module: ServiceModule) {
        this.testController = new Controllers.TestController();
        this.userController = new Controllers.UserController(module.managers.user);

        // Bind routes
        this.testController.bindRoutes(app);
        this.userController.bindRoutes(app);
    }
}