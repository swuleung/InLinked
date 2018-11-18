import { IAuth } from '../utils/lib/auth';
import { BCryptHash } from '../utils/lib/hash';
import { Candidate } from '../models';
import { CandidateRepository } from '../repositories/candidate-repository';
import { isError } from '../utils/exceptions';

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
        try {
            return this.repo.insert(candidate);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

    public async get(id: number): Promise<Candidate> {
        try {
            return this.repo.get(id);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

    public async update(candidate: Candidate): Promise<Candidate> {
        try {
            return this.repo.update(candidate);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

    public async delete(id: number): Promise<void> {
        try {
            return this.repo.delete(id);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }
}
