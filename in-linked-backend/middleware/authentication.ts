import { Request, Response } from 'express';
import { JWTAuth } from '../utils/lib/auth';
import { UnauthenticatedException } from '../utils/exceptions';

/**
 * Authentication middleware to verify auth token sent by user via headers
 *
 * @export
 * @param {JWTAuth} auth - the auth service used for authentication
 * @returns - A middleware function for authenticating
 */
export function authentication(auth: JWTAuth) {
    return async (req: Request, res: Response, next: () => Promise<any>) => {
        const token = req.headers.authorization;
        if (!token)
            throw new UnauthenticatedException('User is unauthenticated!');
        
        const user = await auth.validate(token);
        req.user = user; // Pass user to subsequent middleware
        await next();
    }
}
