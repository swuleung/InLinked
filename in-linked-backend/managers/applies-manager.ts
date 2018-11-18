import { AppliesRepository } from '../repositories';
import { Applies } from '../models/applies';
import { isError } from '../utils/exceptions';

export class AppliesManager {
    private repo: AppliesRepository;

    constructor(repo: AppliesRepository) {
        this.repo = repo;
    }

    /* CRUD */
    public async create(applies: Applies): Promise<Applies> {
        try {
            return await this.repo.insert(applies);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

    public async get(jobId: number, candidateId: number): Promise<Applies> {
        try {
            return await this.repo.get(jobId, candidateId);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

    public async update(applies: Applies): Promise<Applies> {
        try {
            return await this.repo.update(applies);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

    public async delete(jobId: number, candidateId: number): Promise<void> {
        try {
            return await this.repo.delete(jobId, candidateId);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

}
