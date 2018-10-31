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
    public async create(user: User) {
        
    }
}
