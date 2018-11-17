import { Application, NextFunction, Request, Response } from 'express'

import { isError } from '../utils/exceptions';
import { ServiceModule } from '../utils/module/service-module';
import { IController } from './controller.abstract';

import config from '../config/config';
import * as middleware from '../middleware';
import { Role } from '../utils/lib/auth';
import { JobManager } from '../managers';
import { Job, isJob } from '../models';

export class JobController extends IController {
    private jobManager: JobManager;

    constructor(jobManager: JobManager) {
        super();
        this.jobManager = jobManager;
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        const job: Job = req.body;
        const ret = await this.jobManager.create(job);

        // Failed to create, throw error
        if (isError(ret)) {
            res.status(500).send(this.buildErrorRes(ret));
            return;
        }
        res.status(201).send(this.buildSuccessRes(`Successfully created job job '${job.jobId}' for enterprise id '${job.enterpriseId}.`, ret));
    }


    public async get(req: Request, res: Response, next: NextFunction) {
        const job = await this.jobManager.get(req.params.id);

        if (isError(job)) {
            res.status(500).send(this.buildErrorRes(job));
            return;
        }

        res.status(200).send(this.buildSuccessRes(`Successfully fetched job with id '${req.params.id}'.`, job));
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        const newJobData: Job = req.body;
        const job: Job = await this.jobManager.get(req.params.id);

        job.jobTitle = newJobData.jobTitle;
        job.jobDescription = newJobData.jobDescription;
        job.salary = newJobData.salary || job.salary;
        job.employmentType = newJobData.employmentType || job.employmentType;
        job.experienceLevel = newJobData.experienceLevel || job.experienceLevel;
        job.educationLevel = newJobData.educationLevel || job.educationLevel;
        job.city = newJobData.city || job.city;
        job.province = newJobData.province || job.province;
        job.country = newJobData.country || job.country;

        await this.jobManager.update(job);
        res.status(200).send(this.buildSuccessRes(`Job id: ${job.jobId} successfully updated.`));
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const job = await this.jobManager.get(req.params.id);
        if (isJob(job)) {
            await this.jobManager.delete(job.jobId);
        }

        res.status(204).send(this.buildSuccessRes(`Successfully deleted job id ${job.jobId} for enterprise id ${job.enterpriseId}.`));
    }

    public bindRoutes(app: Application, module: ServiceModule) {
        app.route(`/${config.app.api_route}/${config.app.api_ver}/job`)
            .post(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.create.bind(this)
            )

        app.route(`/${config.app.api_route}/${config.app.api_ver}/job/:id`)
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