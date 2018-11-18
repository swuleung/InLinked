import { Application, NextFunction, Request, Response } from 'express'

import { EducationManager } from '../managers';
import { IController } from './controller.abstract';
import { isError } from '../utils/exceptions';
import { Education } from '../models';
import { Role } from '../utils/lib/auth';
import { ServiceModule } from '../utils/module/service-module';

import config from '../config/config';
import * as middleware from '../middleware';

export class EducationController extends IController {

    private educationManger: EducationManager;

    constructor(educationManager: EducationManager) {
        super();
        this.educationManger = educationManager;
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const education: Education = req.body;
            const ret = await this.educationManger.create(education);

            res.status(201).send(this.buildSuccessRes(`Successfully created education entry ${education.educationId} for candidate id '${education.candidateId}'.`, ret));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            const education = await this.educationManger.get(req.params.id);

            res.status(200).send(this.buildSuccessRes(`Successfully fetched education with id '${req.params.id}'.`, education));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            const newEducationData: Education = req.body;
            const education = await this.educationManger.get(req.params.id);

            education.schoolName = newEducationData.schoolName;
            education.startMonth = newEducationData.startMonth;
            education.startYear = newEducationData.startYear;
            education.endMonth = newEducationData.endMonth;
            education.endYear = newEducationData.endYear;
            education.location = newEducationData.location || education.location;
            education.degree = newEducationData.degree || education.degree;

            res.status(200).send(this.buildSuccessRes(`Education id: ${education.educationId} successfully updated.`));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const education = await this.educationManger.get(req.params.id);

            await this.educationManger.delete(education.educationId);
            res.status(204).send(this.buildSuccessRes(`Successfully deleted education id ${education.educationId} for candidate id ${education.candidateId}.`));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public bindRoutes(app: Application, module: ServiceModule): void {
        app.route(`/${config.app.api_route}/${config.app.api_ver}/education`)
        .post(
            middleware.authentication(module.libs.auth),
            middleware.authorization([Role.USER, Role.ADMIN]),
            this.create.bind(this)
        )

    app.route(`/${config.app.api_route}/${config.app.api_ver}/education/:id`)
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
    }

}
