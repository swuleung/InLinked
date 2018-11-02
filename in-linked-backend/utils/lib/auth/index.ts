import * as jwt from 'jsonwebtoken';

import { User } from '../../../models';
import { UserRepository } from '../../../repositories';
import { UnauthorizedException } from '../../exceptions';

export enum Role {
    USER = 'user',
    ADMIN = 'admin'
}

/**
 * User interface for for authentication
 * 
 * @export
 * @interface IUser
 */
export interface IUser {
    userId: number;
    email: string;
    role: Role;
}

/**
 * Gemeric authentication interface for JWT
 * 
 * @export
 * @interface Auth
 */
export interface IAuth {
    authenticate(user: User): string;
    validate(token: string): Promise<IUser>;
}

/**
 * Authentication class used for authenticating different users and assinging tokens for a certain duration
 * 
 * @export
 * @class JWTAuth
 * @implements {Auth}
 */
export class JWTAuth implements Auth {
    private repo: UserRepository;
    private secret: string;

    constructor(repo: UserRepository) {
        this.repo = repo;
        this.secret = process.env.SECRET_KEY || 'secret';
    }

    /**
     * Authenticate a user by generating a token associated to it with an experiation time
     * 
     * @param {User} user - user to authenticate
     * @returns {string} - returns a jwt for that specific user to use for authentication
     * @memberof JWTAuth
     */
    public authenticate(user: User): string {
        return jwt.sign(
            {
                id: user.userId,
                email: user.email,
                role: user.role as Role
            },
            this.secret,
            {
                expiresIn: '2 days'
            }
        );
    }

    /**
     * Validate a given user with a user defined token.
     * Will throw an exception if there is no match.
     * User object from db is returned if there is no discrepency
     * 
     * @param {string} token - token passed in by the client
     * @returns {Promise<IUser>} - promise containing the IUser that can be used to retrieve other data
     * @memberof JWTAuth
     */
    public async validate(token: string): Promise<IUser> {
        try {
            const decode: any = jwt.verify(token, this.secret); // Verify that the given token is a valid token
            const user: any = await this.repo.findByEmail(decode.email);

            return {
                userId: user.id,
                email: user.email,
                role: user.role as Role
            };
        } catch (err) {
            throw new UnauthorizedException(
                'User is unauthorized to access application data.',
                err
            );
        }
    }
}
