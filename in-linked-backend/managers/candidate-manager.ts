import { IAuth } from '../utils/lib/auth';
import { BCryptHash } from '../utils/lib/hash';
import { Candidate } from '../models';

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

    }

    public async get(id: number): Promise<Candidate> {

    }

    public async update(candidate: Candidate): Promise<Candidate> {

    }

    public async delete(id: number): Promise<void> {

    }
}
