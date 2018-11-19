import { AppliesRepository } from '../repositories';
import { Applies } from '../models/applies';

export class AppliesManager {
    private repo: AppliesRepository;

    constructor(repo: AppliesRepository) {
        this.repo = repo;
    }

    /* CRUD */
    public async create(applies: Applies): Promise<Applies> {
        return await this.repo.insert(applies);
    }

    public async get(jobId: number, candidateId: number): Promise<Applies> {
        return await this.repo.get(jobId, candidateId);
    }

    public async update(applies: Applies): Promise<Applies> {
        return await this.repo.update(applies);
    }

    public async delete(jobId: number, candidateId: number): Promise<void> {
        return await this.repo.delete(jobId, candidateId);
    }

}
