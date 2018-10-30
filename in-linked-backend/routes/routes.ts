/**
 * Main route files containing other routes/controllers
 */
import { Application, Router } from 'express';

/* Import controllers */
import * as Controllers from '../controllers';

const router = Router();
router.get('/', Controllers.TestController);

export class Routes {

    /* Controllers */
    public testController: Controllers.TestController;
    
    constructor(app: Application) {
        this.testController = new Controllers.TestController();

        // Bind routes
        this.testController.bindRoute(app);
    }
}