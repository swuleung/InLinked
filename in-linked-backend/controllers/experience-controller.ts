import { Application, NextFunction, Request, Response } from 'express'

import { IController } from './controller.interface';
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
        const experience: Experience = req.body;
        const ret = await this.experienceManager.create(experience);

        // Failed to create, throw error
        if (isError(ret)) {
            res.status(500).send(this.buildErrorRes(ret));
            return;
        }
        res.status(201).send(this.buildSuccessRes(`Successfully created experience for user id '${experience.userId}' with experience id '${experience.experienceId}'.`, ret));
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        const experience = await this.experienceManager.get(req.params.id);

        if (isError(experience)) {
            res.status(500).send(this.buildErrorRes(experience));
            return;
        }

        res.status(200).send(this.buildSuccessRes(`Successfully fetched experience with id '${req.params.id}'.`, experience));
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        const newExperienceData: Experience = req.body;
        const experience = await this.experienceManager.get(newExperienceData.enterpriseId);

        // Update vars
        experience.enterpriseName = newExperienceData.enterpriseName;
        experience.positionName = newExperienceData.positionName;
        experience.description = newExperienceData.description || experience.description;
        experience.startDate = newExperienceData.startDate || experience.startDate;
        experience.location = newExperienceData.location || experience.location;
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const experience = await this.experienceManager.get(req.params.id);
        if (isExperience(experience)) {
            await this.experienceManager.delete(experience.experienceId);
        }
        res.status(204).send(this.buildSuccessRes(`Successfully deleted experience id ${experience.experienceId} for user id ${experience.userId}.`));
    }

    /* Specific functions */
    public async getByUser(req: Request, res: Response, next: NextFunction) {
        const experience = await this.experienceManager.get(req.params.id);

        if (isError(experience[0])) {
            res.status(500).send(this.buildErrorRes(experience[0]));
            return;
        }

        res.status(200).send(this.buildSuccessRes(`Successfully fetched experiences for user id '${req.params.id}' experience`, experience));
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
