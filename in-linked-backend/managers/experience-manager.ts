import { Experience } from '../models/experience';
import { ExperienceRepository, UserRepository } from '../repositories';
import { AccType } from '../utils/lib/auth';
import { InvalidFieldException } from '../utils/exceptions';

export class ExperienceManager {
    private experienceRepo: ExperienceRepository;
    private userRepo: UserRepository

    constructor(experienceRepo: ExperienceRepository, userRepo: UserRepository) {
        this.experienceRepo = experienceRepo;
        this.userRepo = userRepo;
    }

    /* CRUD */
    public async create(experience: Experience): Promise<Experience> {
         // Check if corresponding candidateId is a candidate
         const user = await this.userRepo.get(experience.candidateId);
         if (user.acctype !== AccType.CANDIDATE) {
             throw new InvalidFieldException(`The provided candidateId for the experience does not correspond to a candidate!`, [{
                 fieldName: 'experience.candidate',
                 type: 'number'
             }]);
         }

         // Only if enterpriseId is present
         if (experience.enterpriseId) {
              // Check if corresponding enterpriseId as an enterprise
            const user = await this.userRepo.get(experience.enterpriseId);
            if (user.acctype !== AccType.ENTERPRISE) {
                throw new InvalidFieldException(`The provided enterpriseId for the experience does not correspond to an enterprise!`, [{
                    fieldName: 'experience.enterpriseId',
                    type: 'number'
                }]);
            }
         }

        return await this.experienceRepo.insert(experience);
    }

    public async get(id: number): Promise<Experience> {
        return await this.experienceRepo.get(id);
    }

    public async update(experience: Experience): Promise<Experience> {
        return await this.experienceRepo.update(experience);
    }

    public async delete(id: number): Promise<void> {
        return await this.experienceRepo.delete(id);
    }

    /* OTHER */
    public async getByUser(userId: number): Promise<Experience[]> {
        return await this.experienceRepo.getByUser(userId);
    }

}
