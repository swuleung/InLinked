import { User } from '../models';
import { UserRepository } from '../repositories/user-repository';

/**
 * Manages user account data before sending to repository
 */
export class UserManager {
    private repo: UserRepository;
    // May need hasher
    // May need uathenticator

    constructor(repo: UserRepository) {
        this.repo = repo;
    }

    /* CRUD */
    public async create(user: User): Promise<User> {
        // Hash passwords before creating user

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
    public async changePassword(email: string, newPassword: string, oldPassword: string): Promise<void> {
        const user = await this.repo.findByEmail(email);

        // Verify the password
        return this.repo.changePassword(email, newPassword);
    }
}
