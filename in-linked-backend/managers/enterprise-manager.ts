import { Enterprise } from '../models';
import { EnterpriseRepository } from '../repositories/enterprise-repository';

export class EnterpriseManager {
    private repo: EnterpriseRepository;
    constructor(repo: EnterpriseRepository) {
        this.repo = repo;
    }

    /* CRUD */
    public async create(candidate: Enterprise): Promise<Enterprise> {
        return await this.repo.insert(candidate);
    }

    public async get(id: number): Promise<Enterprise> {
        return await this.repo.get(id);
    }

    public async update(candidate: Enterprise): Promise<Enterprise> {
        return await this.repo.update(candidate);
    }

    public async delete(id: number): Promise<void> {
        return await this.repo.delete(id);
    }
}
