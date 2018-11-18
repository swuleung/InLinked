import { Experience } from '../models/experience';
import { ExperienceRepository } from '../repositories';

export class ExperienceManager {
    private repo: ExperienceRepository;

    constructor(repo: ExperienceRepository) {
        this.repo = repo;
    }

    /* CRUD */
    public async create(experience: Experience): Promise<Experience> {
        return await this.repo.insert(experience);
    }

    public async get(id: number): Promise<Experience> {
        return await this.repo.get(id);
    }

    public async update(experience: Experience): Promise<Experience> {
        return await this.repo.update(experience);
    }

    public async delete(id: number): Promise<void> {
        return await this.repo.delete(id);
    }

    /* OTHER */
    public async getByUser(userId: number): Promise<Experience[]> {
        return await this.repo.getByUser(userId);
    }

}
