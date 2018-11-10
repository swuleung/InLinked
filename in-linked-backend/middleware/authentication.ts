import { Request, Response } from 'express';
import { UnauthenticatedException } from '../utils/exceptions';
import { IAuth } from '../utils/lib/auth';

/**
 * Authentication middleware to verify auth token sent by user via headers
 *
 * @export
 * @param {JWTAuth} auth - the auth service used for authentication
 * @returns - A middleware function for authenticating
 */
export function authentication(auth: IAuth) {
    return async (req: Request, res: Response, next: () => Promise<any>) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new UnauthenticatedException('User is unauthenticated!');
        }
        
        const user = await auth.validate(token);
        req.user = user; // Pass user to subsequent middleware
        await next();
    }
}
