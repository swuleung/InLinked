/**
 * Main route files containing other routes/controllers
 */
import { Application } from 'express';

/* Import controllers */
import * as Controllers from '../controllers';
import { ServiceModule } from '../utils/module/service-module';

export class Routes {

    /* Controllers */
    public userController: Controllers.UserController;
    
    constructor(app: Application, module: ServiceModule) {
        this.userController = new Controllers.UserController(module.managers.user, module.managers.candidate, module.managers.enterprise);

        // Bind routes
        this.userController.bindRoutes(app, module);
    }
}