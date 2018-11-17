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
    public experienceController: Controllers.ExperienceController;
    public jobController: Controllers.JobController;
    public appliesController: Controllers.AppliesController;
    
    constructor(app: Application, module: ServiceModule) {
        this.userController = new Controllers.UserController(module.managers.user, module.managers.candidate, module.managers.enterprise);
        this.experienceController = new Controllers.ExperienceController(module.managers.experience);
        this.jobController = new Controllers.JobController(module.managers.job);
        this.appliesController = new Controllers.AppliesController(module.managers.applies);

        // Bind routes
        this.userController.bindRoutes(app, module);
    }
}