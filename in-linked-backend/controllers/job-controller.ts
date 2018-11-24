import { Application, NextFunction, Request, Response } from 'express'

import { isError } from '../utils/exceptions';
import { ServiceModule } from '../utils/module/service-module';
import { IController } from './controller.abstract';

import config from '../config/config';
import * as middleware from '../middleware';
import { Role } from '../utils/lib/auth';
import { JobManager } from '../managers';
import { Job } from '../models';

export class JobController extends IController {
    private jobManager: JobManager;

    constructor(jobManager: JobManager) {
        super();
        this.jobManager = jobManager;
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const job: Job = req.body.job;
            const ret = await this.jobManager.create(job);
            res.status(201).send(this.buildSuccessRes(`Successfully created job id '${job.jobId}' for enterprise id '${job.enterpriseId}.'`, ret));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }


    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            const job = await this.jobManager.get(req.params.id);
    
            if (isError(job)) {
                res.status(500).send(this.buildErrorRes(job));
                return;
            }
    
            res.status(200).send(this.buildSuccessRes(`Successfully fetched job with id '${req.params.id}'.`, job));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            const newJobData: Job = req.body.job;
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
            job.jobUrl = newJobData.jobUrl || job.jobUrl;
    
            await this.jobManager.update(job);
            res.status(200).send(this.buildSuccessRes(`Job id: ${job.jobId} successfully updated.`));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const job = await this.jobManager.get(req.params.id);
            await this.jobManager.delete(job.jobId);

            res.status(204).send(this.buildSuccessRes(`Successfully deleted job id ${job.jobId} for enterprise id ${job.enterpriseId}.`));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    /* SPECIAL FUNCTIONS */
    public async getByEnterpriseId(req: Request, res: Response, next: NextFunction) {
        try {
            const jobs = await this.jobManager.getByEnterpriseId(req.params.enterpriseId);
            res.status(200).send(this.buildSuccessRes(`Successfully fetched jobs posted by enterprise id '${req.params.enterpriseId}'.`, jobs));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }
    
    public async searchJob(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.query.categories);
            const jobs = await this.jobManager.fuzzySearch(decodeURI(req.query.search), req.query.categories.split(',')); // Categories passed in as query params, provide all column names if no filter is applied
            res.status(200).send(this.buildSuccessRes(`Successfully fetched jobs posted by query: ${decodeURI(req.query.search)}.`, jobs));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public bindRoutes(app: Application, module: ServiceModule) {
        app.route(`/${config.app.api_route}/${config.app.api_ver}/job`)
            .post(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.create.bind(this)
            )
            .get( // Fuzzy searching
                middleware.authentication(module.libs.auth),
                this.searchJob.bind(this)
            );

        app.route(`/${config.app.api_route}/${config.app.api_ver}/job/:id`)
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

        app.route(`/${config.app.api_route}/${config.app.api_ver}/job/enterprise/:enterpriseId`)
            .post(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.getByEnterpriseId.bind(this)
            );
    }
}
