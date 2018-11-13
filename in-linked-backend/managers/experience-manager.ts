import { ExperienceRepository } from '../repositories';
import { Experience } from '../models/experience';

export class ExperienceManager {
    private repo: ExperienceRepository;

    constructor(repo: ExperienceRepository) {
        this.repo = repo;
    }

    /* CRUD */
    public async create(experience: Experience): Promise<Experience> {
        try {
            return await this.repo.insert(experience);
        } catch (ex) {
            return ex.toObject();
        }
    }

    public async get(id: number): Promise<Experience> {
        try {
            return await this.repo.get(id);
        } catch (ex) {
            return ex.toObject();
        }
    }

    public async update(experience: Experience): Promise<Experience> {
        try {
            return await this.repo.update(experience);
        } catch (ex) {
            return ex.toObject();
        }
    }

    public async delete(id: number): Promise<void> {
        try {
            return await this.repo.delete(id);
        } catch (ex) {
            return ex.toObject();
        }
    }

    /* OTHER */
    public async getByUser(userId: number): Promise<Experience[]> {
        try {
            return await this.repo.getByUser(userId);
        } catch (ex) {
            return ex.toObject();
        }
    }

}
