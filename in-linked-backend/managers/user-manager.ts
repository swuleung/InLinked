import { User } from '../models';
import { UserRepository } from '../repositories/user-repository';
import { ValidationException } from '../utils/exceptions';
import { IAuth } from '../utils/lib/auth';
import { BCryptHash } from '../utils/lib/hash';

/**
 * Manages user account data before sending to repository
 */
export class UserManager {
    private repo: UserRepository;
    
    // Lib instances
    private auth: IAuth;
    private hash: BCryptHash;

    constructor(repo: UserRepository, auth: IAuth, hash: BCryptHash) {
        this.repo = repo;
        this.auth = auth;
        this.hash = hash;
    }

    /* CRUD */
    public async create(user: User): Promise<User> {
        // Hash passwords before creating user
        const hashedPass = await this.hash.hashPassword(user.password);
        user.password = hashedPass; // Update password

        return this.repo.insert(user); 
    }

    public async findByEmail(email: string): Promise<User> {
        return this.repo.findByEmail(email);
    }

    public async update(user: User): Promise<User> {

        return this.repo.update(user);
    }

    public async delete(userId: number): Promise<void> {

        return this.repo.delete(userId);
    }

    /* Specific functionality */
    /**
     * Update a user's password after verifying user credentials
     * 
     * @param {string} email - the email of the user
     * @param {string} newPassword - new password to update to
     * @param {string} oldPassword - old password to update to
     * @returns {Promise<void>} 
     * @memberof UserManager
     */
    public async changePassword(email: string, newPassword: string, oldPassword: string): Promise<void> {
        const user = await this.repo.findByEmail(email);
        const validPassword = await this.hash.verifyPassword(oldPassword, user.password); // Check for correct password first
        if (!validPassword) {
            throw new ValidationException('Old password is incorrect.');
        }

        // Verify the password
        const hashedPass = await this.hash.hashPassword(newPassword);
        return this.repo.changePassword(email, hashedPass);
    }

    /**
     * Log a user in by verifying their credentials and then authorizing them to the server
     * Return auth token for access.
     * 
     * @param {string} email - email of the user to authorize
     * @param {string} password - password of the user
     * @returns {Promise<string>} - return a JWT to the user
     * @memberof UserManager
     */
    public async login(email: string, password: string): Promise<string> {
        const user = await this.repo.findByEmail(email);

        if (await this.hash.verifyPassword(password, user.password)) {
            return this.auth.authenticate(user); // Return token for auth
        }
        throw new ValidationException('Wrong credentials');
    }
}
