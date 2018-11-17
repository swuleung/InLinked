import { Application, NextFunction, Request, Response } from 'express'

import { IController } from './controller.abstract';
import { AppliesManager } from '../managers';
import { ServiceModule } from '../utils/module/service-module';
import { Applies, isApplies } from '../models/applies';
import { isError } from '../utils/exceptions';
import { Role } from '../utils/lib/auth';

import config from '../config/config';
import * as middleware from '../middleware';

export class AppliesController extends IController {

    private appliesManager: AppliesManager;

    constructor(appliesManager: AppliesManager) {
        super();
        this.appliesManager = appliesManager;
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        const applies: Applies = req.body;
        const ret = await this.appliesManager.create(applies);

        if (isError(ret)) {
            res.status(500).send(this.buildErrorRes(ret));
            return;
        }
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        const applies = await this.appliesManager.get(req.params.candidateId, req.params.jobId);

        if (isError(applicationCache)) {
            res.status(500).send(this.buildErrorRes(applies));
            return;
        }

        res.status(200).send(this.buildSuccessRes(`Successfully fetched job application with candidate id '${req.params.userId}' and job id '${req.params.jobId}.`, applies));
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        const newAppliesData: Applies = req.body;
        const applies = await this.appliesManager.get(req.params.candidateId, req.params.jobId);

        // Only used to update application date
        applies.dateApplied = newAppliesData.dateApplied;

        await this.appliesManager.update(applies);

        res.status(200).send(this.buildSuccessRes(`Successfully updated job application with candidate id '${req.params.userId}' and job id '${req.params.jobId}.`, applies));
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const applies = await this.appliesManager.get(req.params.candidateId, req.params.jobId);
        if (isApplies(applies)) {
            await this.appliesManager.delete(applies.candidateId, applies.jobId);
        }
        res.status(204).send(this.buildSuccessRes(`Successfully deleted application with candidate id ${applies.candidateId} for joib id ${applies.jobId}.`));
    }

    public bindRoutes(app: Application, module: ServiceModule): void {
        app.route(`/${config.app.api_route}/${config.app.api_ver}/applies`)
            .post(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.create.bind(this)
            )

        app.route(`/${config.app.api_route}/${config.app.api_ver}/applies/:candidateId/:jobId`)
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
