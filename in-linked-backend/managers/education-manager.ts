import { Education } from '../models';
import { EducationRepository } from '../repositories/education-repository';

export class EducationManager {
    private repo: EducationRepository;

    constructor(repo: EducationRepository) {
        this.repo = repo;
    }

    /* CRUD */
    public async create(education: Education): Promise<Education> {
        return await this.repo.insert(education);
    }

    public async get(id: number): Promise<Education> {
        return await this.repo.get(id);
    }

    public async update(experience: Education): Promise<Education> {
        return await this.repo.update(experience);
    }

    public async delete(id: number): Promise<void> {
        return await this.repo.delete(id);
    }
}
