import { Candidate } from '../models';
import { CandidateRepository } from '../repositories/candidate-repository';

/**
 * Manages candidate information that is tied to the user
 */
export class CandidateManager {
    private repo: CandidateRepository;

    constructor(repo: CandidateRepository) {
        this.repo = repo;
    }

    /* CRUD */
    public async create(candidate: Candidate): Promise<Candidate> {
        return await this.repo.insert(candidate);
    }

    public async get(id: number): Promise<Candidate> {
        return await this.repo.get(id);
    }

    public async update(candidate: Candidate): Promise<Candidate> {
        return await this.repo.update(candidate);
    }

    public async delete(id: number): Promise<void> {
        return await this.repo.delete(id);
    }
}
