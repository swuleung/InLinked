import { IAuth } from '../utils/lib/auth';
import { BCryptHash } from '../utils/lib/hash';
import { Candidate } from '../models';
import { CandidateRepository } from '../repositories/candidate-repository';

/**
 * Manages candidate information that is tied to the user
 */
export class CandidateManager {
    private repo: CandidateRepository;

    // Lib instances
    private auth: IAuth;
    private hash: BCryptHash;

    constructor(repo: CandidateRepository, auth: IAuth, hash: BCryptHash) {
        this.repo = repo;
        this.auth = auth;
        this.hash = hash;
    }

    /* CRUD */
    public async create(candidate: Candidate): Promise<Candidate> {
        return this.repo.insert(candidate);
    }

    public async get(id: number): Promise<Candidate> {
        return this.repo.get(id);
    }

    public async update(candidate: Candidate): Promise<Candidate> {
        return this.repo.update(candidate);
    }

    public async delete(id: number): Promise<void> {
        return this.repo.delete(id);
    }
}
