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
        const user: User = req.body.user; // Create a user from body
        const ret = await this.userManager.create(user);

        // Failed create, throw error cause of duplicate user
        if (isError(ret)) {
            res.status(500).send(this.buildErrorRes(ret));
            return;
        }

        // Create entries based on account type
        if (user.acctype === AccType.ENTERPRISE) {
            const enterprise: Enterprise = req.body.enterprise;
            enterprise.enterpriseId = user.userId; // Update the associated ID
            const enterpriseRet = await this.enterpriseManager.create(enterprise);
            if (isError(enterpriseRet)) {
                res.status(500).send(this.buildErrorRes(enterpriseRet));
                return;
            }
        } else if (user.acctype === AccType.CANDIDATE) {
            const candidate: Candidate = req.body.candidate;
            candidate.candidateId = user.userId; // Update the associated ID
            const candidateRet = await this.candidateManager.create(candidate);
            if (isError(candidateRet)) {
                res.status(500).send(this.buildErrorRes(candidateRet));
                return;
            }
        }
        
        res.status(201).send(ret);
    }

    // Gets generic info for user given an id
    public async get(req: Request, res: Response, next: NextFunction) {
        let user = await this.userManager.get(req.params.id);

        // If response was an error, return it
        if (isError(user)) {
            res.status(500).send(this.buildErrorRes(user));
            return;
        }

        let special: any = null; // Store result for candidates/enterprise
        if (user.acctype === AccType.ENTERPRISE) {
            special = await this.enterpriseManager.get(user.userId);
        } else if (user.acctype === AccType.CANDIDATE) {
            special = await this.candidateManager.get(user.userId);
        }

        if (isError(special)) {
            res.status(500).send(this.buildErrorRes(user));
            return;
        }

        // Verify that responses for special objects succeeded
        user = isCandidate(special) || isEnterprise(special) ? sanitizeUser(user) : null;
        res.status(200).send({ 
            ...user,
            ...special
        }); // Return details for user (with special data)
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        const newUserData: User = req.body.user;
        const user = await this.userManager.get(req.params.id);

        if (isError(user)) {
            res.status(500).send(this.buildErrorRes(user));
            return;
        }

        // Update vars
        user.coverPhoto = newUserData.coverPhoto;
        user.headline = newUserData.headline;
        user.profilePicture = newUserData.profilePicture;

        const updatedRet = await this.userManager.update(user);
        if (isError(updatedRet)) {
            res.status(500).send(this.buildErrorRes(updatedRet));
            return;
        }

        if (user.acctype === AccType.CANDIDATE) {
            const newCandData: Candidate = req.body.candidate;
            const cand = await this.candidateManager.get(user.userId);

            cand.fullName = newCandData.fullName;
            cand.skills = newCandData.skills || cand.skills;
            cand.educationLevel = newCandData.educationLevel || cand.educationLevel;
            cand.displayEmail = newCandData.displayEmail || cand.displayEmail;

            const candUpdateRet = await this.candidateManager.update(cand);
            if (isError(candUpdateRet)) {
                res.status(500).send(this.buildErrorRes(updatedRet));
                return;
            }
        } else if (user.acctype === AccType.ENTERPRISE) {
            const newEnterpriseData: Enterprise = req.body.enterprise;
            const enterprise: Enterprise = await this.enterpriseManager.get(user.userId);

            enterprise.enterpriseName = newEnterpriseData.enterpriseName;
            enterprise.enterpriseDescription = newEnterpriseData.enterpriseDescription;
            enterprise.ceo = newEnterpriseData.ceo || enterprise.ceo;
            enterprise.headquarters = newEnterpriseData.headquarters || enterprise.headquarters;
            enterprise.industry = newEnterpriseData.industry || enterprise.industry;

            const enterpriseUpdateRet = await this.enterpriseManager.update(enterprise);
            if (isError(enterpriseUpdateRet)) {
                res.status(500).send(this.buildErrorRes(updatedRet));
                return;
            }
        }

        res.status(200).send(this.buildSuccessRes(`User id: ${user.userId}, username: ${user.username} successfully updated.`));
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const user = await this.userManager.get(req.params.id);

        if (isError(user)) {
            res.status(500).send(this.buildErrorRes(user));
            return;
        }

        if (user.acctype === AccType.CANDIDATE) {
            await this.candidateManager.delete(user.userId);
        } else if (user.acctype === AccType.ENTERPRISE) {
            await this.enterpriseManager.delete(user.userId);
        }

        const deleteRet = await this.userManager.delete(req.params.id); // Delete the user by ID
        if (isError(deleteRet)) {
            res.status(500).send(this.buildErrorRes(deleteRet));
            return;
        }

        res.status(204).send(this.buildSuccessRes(`User id: ${user.userId}, username: ${user.username} successfully deleted.`));
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
        const email: string = req.body.email;
        const pass: string = req.body.password;
        const authToken: string = await this.userManager.login(email, pass);

        if (isError(authToken)) {
            res.status(500).send(this.buildErrorRes(authToken));
        } else {
            res.send({ authToken });
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
        const email = req.body.email;
        const oldPass = req.body.oldPassword;
        const newPass = req.body.newPassword;
        const ret = await this.userManager.changePassword(email, newPass, oldPass);
        if (isError(ret)) {
            res.status(500).send(this.buildErrorRes(ret));
            return;
        }
        res.status(204).send({ ret }); // Send no content
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
        const username = req.params.username;
        const ret = await this.userManager.findByUsername(username);
        if (isError(ret)) {
            res.status(500).send(this.buildErrorRes(ret));
            return;
        }
        res.status(200).send({ ret });
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
            )
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
            .get(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
                this.findByUsername.bind(this)
            );
    }
}