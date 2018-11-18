/**
 * Main route files containing other routes/controllers
 */
import { Application } from 'express';

/* Import controllers */
import * as Controllers from '../controllers';
import { ServiceModule } from '../utils/module/service-module';

export class Routes {

    /* Controllers */
    private userController: Controllers.UserController;
    private experienceController: Controllers.ExperienceController;
    private jobController: Controllers.JobController;
    private appliesController: Controllers.AppliesController;
    private educationController: Controllers.EducationController;
    
    constructor(app: Application, module: ServiceModule) {
        this.userController = new Controllers.UserController(module.managers.user, module.managers.candidate, module.managers.enterprise);
        this.experienceController = new Controllers.ExperienceController(module.managers.experience);
        this.jobController = new Controllers.JobController(module.managers.job);
        this.appliesController = new Controllers.AppliesController(module.managers.applies);
        this.educationController = new Controllers.EducationController(module.managers.education);

        // Bind routes
        this.userController.bindRoutes(app, module);
        this.experienceController.bindRoutes(app, module);
        this.jobController.bindRoutes(app, module);
        this.appliesController.bindRoutes(app, module);
        this.educationController.bindRoutes(app, module);
    }
}