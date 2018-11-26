import { Application, NextFunction, Request, Response } from 'express'

import { IController } from './controller.abstract';
import { AppliesManager } from '../managers';
import { ServiceModule } from '../utils/module/service-module';
import { Applies } from '../models/applies';
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
        try {
            const applies: Applies = req.body.applies;
            const ret = await this.appliesManager.create(applies);
    
            res.status(201).send(this.buildSuccessRes(`Successfully created job application for candidate id '${applies.candidateId}'.`, ret));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            const applies = await this.appliesManager.get(req.params.jobId, req.params.candidateId);
    
            res.status(200).send(this.buildSuccessRes(`Successfully fetched job application with candidate id '${req.params.candidateId}' and job id '${req.params.jobId}.`, applies));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            const newAppliesData: Applies = req.body.applies;
            const applies = await this.appliesManager.get(req.params.jobId, req.params.candidateId);
    
            // Only used to update application date
            applies.dateApplied = newAppliesData.dateApplied;
    
            await this.appliesManager.update(applies);
    
            res.status(200).send(this.buildSuccessRes(`Successfully updated job application with candidate id '${req.params.candidateId}' and job id '${req.params.jobId}.`, applies));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const applies = await this.appliesManager.get(req.params.jobId, req.params.candidateId);
            await this.appliesManager.delete(applies.jobId, applies.candidateId);
            res.status(204).send(this.buildSuccessRes(`Successfully deleted application with candidate id ${applies.candidateId} for job id ${applies.jobId}.`));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    /* Custom functions */
    public async getByCandidate(req: Request, res: Response, next: NextFunction) {
        try {
            const applications = await this.appliesManager.getByUser(req.params.candidateId);
            res.status(200).send(this.buildSuccessRes(`Successfully fetched applications sent by candidateId '${req.params.candidateId}' experience.`, applications));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async getByJob(req: Request, res: Response, next: NextFunction) {
        try {
            const applications = await this.appliesManager.getByJob(req.params.jobId);
            res.status(200).send(this.buildSuccessRes(`Successfully fetched number of users who applied.`, applications));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public bindRoutes(app: Application, module: ServiceModule): void {
        app.route(`/${config.app.api_route}/${config.app.api_ver}/applies`)
            .post(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.create.bind(this)
            );

        app.route(`/${config.app.api_route}/${config.app.api_ver}/applies/:jobId/:candidateId`)
            .get(
                middleware.authentication(module.libs.auth),
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

        app.route(`/${config.app.api_route}/${config.app.api_ver}/applies/candidate/:candidateId`)
            .post(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.getByCandidate.bind(this)
            );

        app.route(`/${config.app.api_route}/${config.app.api_ver}/applies/job/:jobId`)
            .post(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.getByJob.bind(this)
            );


        
    }

}
