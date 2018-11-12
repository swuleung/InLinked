/**
 * Controller for dealing with user accounts
 */
import { Application, NextFunction, Request, Response } from 'express';

import { UserManager, CandidateManager, EnterpriseManager } from '../managers';
import { User, isUser, isCandidate, isEnterprise, Candidate, Enterprise } from '../models';
import { IController } from './controller.interface';
import { Role, AccType } from '../utils/lib/auth';
import { ServiceModule } from '../utils/module/service-module';
import { sanitizeUser } from '../utils/lib/sanitize';

import config from '../config/config';
import * as middleware from '../middleware';

export class UserController implements IController {

    private userManager: UserManager;
    private candidateManager: CandidateManager;
    private enterpriseManager: EnterpriseManager;

    constructor(userManager: UserManager, candidateManager: CandidateManager, enterpriseManager: EnterpriseManager) {
        this.userManager = userManager;
        this.candidateManager = candidateManager;
        this.enterpriseManager = enterpriseManager;
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        const user: User = req.body.user; // Create a user from body
        const ret = await this.userManager.create(user);

        // Failed create, threw error cause of duplicate user
        if (!isUser(ret)) {
            res.status(201).send({ ret })
        }

        // Create entries based on account type
        if (user.acctype === AccType.ENTERPRISE) {
            await this.enterpriseManager.create(req.body.enterprise);
        } else if (user.acctype === AccType.CANDIDATE) {
            await this.candidateManager.create(req.body.candidate);
        }
        res.status(201).send({ ret });
    }

    // Gets generic info for user given an id
    public async get(req: Request, res: Response, next: NextFunction) {
        let user = await this.userManager.get(req.params.id);

        // If response was an error, return it
        if (!isUser(user)) {
            res.status(200).send({ ...user });
        }

        let special: any = null; // Store result for candidates/enterprise
        if (user.acctype === AccType.ENTERPRISE) {
            special = await this.enterpriseManager.get(req.body.enterprise);
        } else if (user.acctype === AccType.CANDIDATE) {
            special = await this.candidateManager.get(req.body.candidate);
        }

        // Verify that responses for special objects succeeded
        user = isCandidate(special) || isEnterprise(special) ? sanitizeUser(user) : null
        res.status(200).send({ 
            ...user,
            ...special
        }); // Return details for user (with special data)
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        const newUserData: User = req.body.user;
        const user = await this.userManager.findByEmail(req.body.user.email);

        // Update vars
        user.coverPhoto = newUserData.coverPhoto;
        user.headline = newUserData.headline;
        user.profilePicture = newUserData.profilePicture;

        // TODO: Update candidate and enterprise
        if (user.acctype === AccType.CANDIDATE) {
            const newCandData: Candidate = req.body.candidate;
            const cand = await this.candidateManager.get(user.userId);

            cand.fullName = newCandData.fullName;
            cand.skills = newCandData.skills;
            cand.experience = newCandData.experience;
            cand.educationLevel = newCandData.educationLevel;

            await this.candidateManager.update(cand);
        } else if (user.acctype === AccType.ENTERPRISE) {
            const newEnterpriseData: Enterprise = req.body.enterprise;
            const enterprise: Enterprise = await this.enterpriseManager.get(user.userId);

            enterprise.enterpriseName = newEnterpriseData.enterpriseName;
            enterprise.enterpriseDescription = newEnterpriseData.enterpriseDescription;
            enterprise.ceo = newEnterpriseData.ceo;
            enterprise.headquarters = newEnterpriseData.headquarters;
            enterprise.industry = newEnterpriseData.industry;

            await this.enterpriseManager.update(enterprise);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const user = await this.userManager.get(req.params.id);
        if (isUser(user)) { // Make sure it is not an error
            if (user.acctype === AccType.CANDIDATE) {
                await this.candidateManager.delete(user.userId);
            } else if (user.acctype === AccType.ENTERPRISE) {
                await this.enterpriseManager.delete(user.userId);
            }
    
            await this.userManager.delete(req.params.id); // Delete the user by ID
            
        }
        res.status(204);
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
        res.send({ authToken });
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
        await this.userManager.changePassword(email, newPass, oldPass);
        res.status(204); // Send no content
    } 

    /**
     * Bind the different functions to routes
     * @param app Express app to bind the routes to
     */
    public bindRoutes(app: Application, module: ServiceModule): void {
        // Bind with this to provide contex to this curent object (user controller)
        app.route(`/${config.app.api_route}/${config.app.api_ver}/user`)
            .post(
                middleware.authentication(module.libs.auth),
                middleware.authorization([Role.USER, Role.ADMIN]),
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
    }
}