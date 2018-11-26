import { Application, NextFunction, Request, Response } from 'express'

import { IController } from './controller.abstract';
import { ExperienceManager } from '../managers';
import { Role } from '../utils/lib/auth';
import { ServiceModule } from '../utils/module/service-module';
import { isExperience, Experience } from '../models/experience';
import { isError } from '../utils/exceptions';

import config from '../config/config';
import * as middleware from '../middleware';

export class ExperienceController extends IController {

    private experienceManager: ExperienceManager;

    constructor(experienceManager: ExperienceManager) {
        super();
        this.experienceManager = experienceManager;
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const experience: Experience = req.body.experience;
            const ret = await this.experienceManager.create(experience);
            res.status(201).send(this.buildSuccessRes(`Successfully created experience for user id '${experience.candidateId}' with experience id '${experience.experienceId}'.`, ret));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            const experience = await this.experienceManager.get(req.params.id);
            res.status(200).send(this.buildSuccessRes(`Successfully fetched experience with id '${req.params.id}'.`, experience));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            const newExperienceData: Experience = req.body.experience;
            const experience = await this.experienceManager.get(req.params.id);
    
            // Update vars
            experience.enterpriseId = newExperienceData.enterpriseId; // Allow nulls
            experience.enterpriseName = newExperienceData.enterpriseName;
            experience.positionName = newExperienceData.positionName;
            experience.description = newExperienceData.description || experience.description;
            experience.startMonth = newExperienceData.startMonth,
            experience.startYear = newExperienceData.startYear,
            experience.endMonth = newExperienceData.endMonth, // Allow nulls
            experience.endYear = newExperienceData.endYear, // Allow nulls
            experience.location = newExperienceData.location || experience.location;
    
            await this.experienceManager.update(experience);
    
            res.status(200).send(this.buildSuccessRes(`Experience id: ${experience.experienceId} successfully updated.`));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const experience = await this.experienceManager.get(req.params.id);
            await this.experienceManager.delete(experience.experienceId);
            res.status(204).send(this.buildSuccessRes(`Successfully deleted experience id ${experience.experienceId} for user id ${experience.candidateId}.`));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    /* Specific functions */
    public async getByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const experience = await this.experienceManager.getByUser(req.params.candidateId);
            res.status(200).send(this.buildSuccessRes(`Successfully fetched experiences for user id '${req.params.candidateId}' experience`, experience));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
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
                this.get.bind(this)
            )
            .put(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.update.bind(this)
            )
            .delete(
                middleware.authentication(module.libs.auth),
                this.delete.bind(this)
            );
        
        app.route(`/${config.app.api_route}/${config.app.api_ver}/experience/user/:candidateId`)
            .post(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.getByUser.bind(this)
            );
    }
}
