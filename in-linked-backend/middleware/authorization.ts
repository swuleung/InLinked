import { Request, Response } from 'express';
import { IUser, Role } from '../utils/lib/auth';
import { PermissionException, ExceptionBase } from '../utils/exceptions';
import { buildErrorRes } from '../utils/errors';

/**
 * Verifies that a particular user is allowed to this action based on the roles allowed for the action and user's roles
 *
 * @export
 * @param {Role[]} roles - list of allowed roles to hit the endpoint
 * @returns - middleware that handles user authorization
 */
export function authorization(roles: Role[]) {
    return async (req: Request, res: Response, next: () => Promise<any>) => {
        try {
            if (!req.body || !req.body.user) {
                throw new ExceptionBase(10000, 'Missing request body with user role.');
                // res.status(500).send({ body: req.body.user, ext: req.body });
                // return;
            }

            const user: IUser = req.body.user;

            // Check if user is able to perform this action
            if (roles.indexOf(user.role) < 0) {
                throw new PermissionException();
            }
            await next();
        } catch (err) {
            res.status(500).send(buildErrorRes(err.toObject()));
        }
    }
}