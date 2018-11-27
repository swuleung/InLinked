/**
 * Controller for dealing with user accounts
 */
import { Application, NextFunction, Request, Response } from 'express';

import { UserManager, CandidateManager, EnterpriseManager } from '../managers';
import { User, isUser, isCandidate, isEnterprise, Candidate, Enterprise } from '../models';
import { IController } from './controller.abstract';
import { Role, AccType } from '../utils/lib/auth';
import { ServiceModule } from '../utils/module/service-module';
import { isError } from '../utils/exceptions';
import { sanitizeUser } from '../utils/lib/sanitize';

import config from '../config/config';
import * as middleware from '../middleware';

export class UserController extends IController {

    private userManager: UserManager;
    private candidateManager: CandidateManager;
    private enterpriseManager: EnterpriseManager;

    constructor(userManager: UserManager, candidateManager: CandidateManager, enterpriseManager: EnterpriseManager) {
        super();
        this.userManager = userManager;
        this.candidateManager = candidateManager;
        this.enterpriseManager = enterpriseManager;
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const user: User = req.body.user; // Create a user from body
            await this.userManager.create(user);
    
            // Create entries based on account type
            if (user.acctype === AccType.ENTERPRISE) {
                const enterprise: Enterprise = req.body.enterprise;
                enterprise.enterpriseId = user.userId; // Update the associated ID
                await this.enterpriseManager.create(enterprise);
            } else if (user.acctype === AccType.CANDIDATE) {
                const candidate: Candidate = req.body.candidate;
                candidate.candidateId = user.userId; // Update the associated ID
                await this.candidateManager.create(candidate);
            }
            res.status(201).send(this.buildSuccessRes(`Successfully created account for ${user.email}.`, { ...sanitizeUser(user) })); // Return details for user (with special data)
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    // Gets generic info for user given an id
    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            let user = await this.userManager.get(req.params.id);

            let special: any = null; // Store result for candidates/enterprise
            if (user.acctype === AccType.ENTERPRISE) {
                special = await this.enterpriseManager.get(user.userId);
            } else if (user.acctype === AccType.CANDIDATE) {
                special = await this.candidateManager.get(user.userId);
            }

            // Verify that responses for special objects succeeded
            user = isCandidate(special) || isEnterprise(special) ? sanitizeUser(user) : null;

            // Automatically login 
            res.status(200).send(this.buildSuccessRes(`Successfully fetched account for ${user.email}.`, { ...sanitizeUser(user), ...special })); // Return details for user (with special data)
            
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            const newUserData: User = req.body.user;
            const user = await this.userManager.get(req.params.id);

            // Update vars
            user.coverPhoto = newUserData.coverPhoto || user.coverPhoto;
            user.headline = newUserData.headline;
            user.profilePicture = newUserData.profilePicture || user.profilePicture;
            user.lastActiveDate = newUserData.lastActiveDate;

            await this.userManager.update(user);

            if (user.acctype === AccType.CANDIDATE) {
                const newCandData: Candidate = req.body.candidate;
                const cand = await this.candidateManager.get(user.userId);

                cand.fullName = newCandData.fullName;
                cand.skills = newCandData.skills;
                cand.educationLevel = newCandData.educationLevel || cand.educationLevel;
                cand.displayEmail = newCandData.displayEmail;

                await this.candidateManager.update(cand);
            } else if (user.acctype === AccType.ENTERPRISE) {
                const newEnterpriseData: Enterprise = req.body.enterprise;
                const enterprise: Enterprise = await this.enterpriseManager.get(user.userId);

                enterprise.enterpriseName = newEnterpriseData.enterpriseName;
                enterprise.enterpriseDescription = newEnterpriseData.enterpriseDescription;
                enterprise.ceo = newEnterpriseData.ceo || enterprise.ceo;
                enterprise.headquarters = newEnterpriseData.headquarters || enterprise.headquarters;
                enterprise.industry = newEnterpriseData.industry || enterprise.industry;

                await this.enterpriseManager.update(enterprise);
            }

            res.status(200).send(this.buildSuccessRes(`User id: ${user.userId}, username: ${user.username} successfully updated.`));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
        
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userManager.get(req.params.id);
    
            if (user.acctype === AccType.CANDIDATE) {
                await this.candidateManager.delete(user.userId);
            } else if (user.acctype === AccType.ENTERPRISE) {
                await this.enterpriseManager.delete(user.userId);
            }
    
            await this.userManager.delete(req.params.id); // Delete the user by ID
    
            res.status(200).send(this.buildSuccessRes(`User id: ${user.userId}, username: ${user.username} successfully deleted.`));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    /* Specific functions */

    /**
     * Forwards login requerst for the user and returns auth token
     *
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @memberof UserController
     */
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const email: string = req.body.email;
            const pass: string = req.body.password;
            const authToken: string = await this.userManager.login(email, pass);

            res.send(this.buildSuccessRes(`Successfully logged in for user id ${email}.`, { authToken }));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    /**
     * Forwards request to update the password of the user
     *
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @memberof UserController
     */
    public async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.body.email;
            const oldPass = req.body.oldPassword;
            const newPass = req.body.newPassword;
            await this.userManager.changePassword(email, newPass, oldPass);
            res.status(204).send({ }); // Send no content
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    /**
     * Return data corresponding to a user by their username
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next
     * @memberof UserController
     */
    public async findByUsername(req: Request, res: Response, next: NextFunction) {
        try {
            const username = req.params.username;
            let ret = await this.userManager.findByUsername(username);

            let special: any = null;
            if (ret.acctype === AccType.ENTERPRISE) {
                special = await this.enterpriseManager.get(ret.userId);
            } else if (ret.acctype === AccType.CANDIDATE) {
                special = await this.candidateManager.get(ret.userId);
            }

            // Verify that responses for special objects succeeded
            ret = isCandidate(special) || isEnterprise(special) ? sanitizeUser(ret) : null;

            res.status(200).send(this.buildSuccessRes(`Successfully fetched username ${username}.`, { ...sanitizeUser(ret), ...special }));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async searchCandidate(req: Request, res: Response, next: NextFunction) {
        try {
            const candidateCategories = (req.query.categories && req.query.categories.split(',')) || ['Username', 'Headline', 'Email', 'FullName', 'Skills', 'EducationLevel'];

            // Check for matching user columns and candidate columns
            const candidates = await this.candidateManager.fuzzySearch(decodeURI(req.query.search), candidateCategories);
            res.status(200).send(this.buildSuccessRes(`Successfully fetched results for searching candidates.`, candidates));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    public async searchEnterprise(req: Request, res: Response, next: NextFunction) {
        try {
            const enterpriseCategories = (req.query.categories && req.query.categories.split(',')) || ['Headline', 'Email', 'EnterpriseName', 'EnterpriseDescription', 'CEO', 'Headquarters', 'Industry'];

            // Check for matching user columns and candidate columns
            const enterprises = await this.enterpriseManager.fuzzySearch(decodeURI(req.query.search), enterpriseCategories);
            res.status(200).send(this.buildSuccessRes(`Successfully fetched results for searching enterprises.`, enterprises));
        } catch (ex) {
            res.status(500).send(this.buildErrorRes(isError(ex) ? ex.toObject() : { message: ex.message }));
        }
    }

    /**
     * Bind the different functions to routes
     * @param app Express app to bind the routes to
     */
    public bindRoutes(app: Application, module: ServiceModule): void {
        // Bind with this to provide contex to this curent object (user controller)
        app.route(`/${config.app.api_route}/${config.app.api_ver}/user`)
            .post(
                this.create.bind(this)
            );
        app.route(`/${config.app.api_route}/${config.app.api_ver}/user/:id`)
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
                middleware.authorization([Role.ADMIN]),
                this.delete.bind(this)
            );

        app.route(`/${config.app.api_route}/${config.app.api_ver}/login`)
            .post(
                this.login.bind(this)
            );

        app.route(`/${config.app.api_route}/${config.app.api_ver}/user/changepass`)
            .post(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.changePassword.bind(this)
            );

        app.route(`/${config.app.api_route}/${config.app.api_ver}/user/:username`)
            .post(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.findByUsername.bind(this)
            );

        app.route(`/${config.app.api_route}/${config.app.api_ver}/user/search/candidate`)
            .get(
                middleware.authentication(module.libs.auth),
                this.searchCandidate.bind(this)
            );

        app.route(`/${config.app.api_route}/${config.app.api_ver}/user/search/enterprise`)
            .get(
                middleware.authentication(module.libs.auth),
                this.searchEnterprise.bind(this)
            );

    }
}