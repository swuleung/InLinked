import { Education } from '../models';
import { UserRepository, EducationRepository } from '../repositories';
import { AccType } from '../utils/lib/auth';
import { InvalidFieldException } from '../utils/exceptions';

export class EducationManager {
    private educationRepo: EducationRepository;
    private userRepo: UserRepository;

    constructor(educationRepo: EducationRepository, userRepo: UserRepository) {
        this.educationRepo = educationRepo;
        this.userRepo = userRepo;
    }

    /* CRUD */
    public async create(education: Education): Promise<Education> {
        // We need to make sure that the user exists and it is a candidate
        const user = await this.userRepo.get(education.candidateId); // Will throw exception if user does not exist
        if (user.acctype !== AccType.CANDIDATE) {
            throw new InvalidFieldException(`The provided candidateId for education does not correspond to a candidate!`, [{
                 fieldName: 'experience.candidateId',
                 type: 'number'
             }]);
        }
        return await this.educationRepo.insert(education);
    }

    public async get(id: number): Promise<Education> {
        return await this.educationRepo.get(id);
    }

    public async update(education: Education): Promise<Education> {
        // We need to make sure that the user exists and it is a candidate
        const user = await this.userRepo.get(education.candidateId); // Will throw exception if user does not exist
        if (user.acctype !== AccType.CANDIDATE) {
            throw new InvalidFieldException(`The provided candidateId for education does not correspond to a candidate!`, [{
                 fieldName: 'experience.candidateId',
                 type: 'number'
             }]);
        }
        return await this.educationRepo.update(education);
    }

    public async delete(id: number): Promise<void> {
        return await this.educationRepo.delete(id);
    }

    /* SPECIAL FUNCTIONS */
    public async getByUserId(candidateId: number): Promise<Education[]> {
        return await this.educationRepo.getByUserId(candidateId);
    }
}
