import { EnterpriseRepository } from '../repositories/enterprise-repository';
import { IAuth } from '../utils/lib/auth';
import { BCryptHash } from '../utils/lib/hash';
import { Enterprise } from '../models';
import { isError } from '../utils/exceptions';

export class EnterpriseManager {
    private repo: EnterpriseRepository;

    // Lib instances
    private auth: IAuth;
    private hash: BCryptHash;

    constructor(repo: EnterpriseRepository, auth: IAuth, hash: BCryptHash) {
        this.repo = repo;
        this.auth = auth;
        this.hash = hash;
    }

    /* CRUD */
    public async create(candidate: Enterprise): Promise<Enterprise> {
        try {
            return await this.repo.insert(candidate);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

    public async get(id: number): Promise<Enterprise> {
        try {
            return await this.repo.get(id);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

    public async update(candidate: Enterprise): Promise<Enterprise> {
        try {
            return await this.repo.update(candidate);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

    public async delete(id: number): Promise<void> {
        return await this.repo.delete(id);
    }
}
