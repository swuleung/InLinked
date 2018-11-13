import { Application, NextFunction, Request, Response } from 'express'

import { IController } from './controller.interface';
import { ExperienceManager } from '../managers';
import { Role } from '../utils/lib/auth';
import { ServiceModule } from '../utils/module/service-module';

import config from '../config/config';
import * as middleware from '../middleware';

export class ExperienceController implements IController {

    private experienceManager: ExperienceManager;

    constructor(experienceManager: ExperienceManager) {
        this.experienceManager = experienceManager;
    }

    public async create(req: Request, res: Response, next: NextFunction) {

    }

    public async get(req: Request, res: Response, next: NextFunction) {
        
    }

    public async update(req: Request, res: Response, next: NextFunction) {

    }

    public async delete(req: Request, res: Response, next: NextFunction) {

    }

    public bindRoutes(app: Application, module: ServiceModule): void {
        app.route(`/${config.app.api_route}/${config.app.api_ver}/experience`)
            .post(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.create.bind(this)
            )

        app.route(`/${config.app.api_route}/${config.app.api_ver}/experience/:id`)
            .get(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.get.bind(this)
            )
            .put(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.update.bind(this)
            )
            .delete(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.delete.bind(this)
            );
    }
}
