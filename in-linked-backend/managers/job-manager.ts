import { Job } from '../models';
import { JobRepository } from '../repositories/job-repository';
import { UserRepository } from '../repositories';
import { AccType } from '../utils/lib/auth';
import { InvalidFieldException } from '../utils/exceptions';

export class JobManager {
    private jobRepo: JobRepository;
    private userRepo: UserRepository;

    constructor(jobRepo: JobRepository, userRepo: UserRepository) {
        this.jobRepo = jobRepo;
        this.userRepo = userRepo;
    }

    /* CRUD */
    public async create(job: Job): Promise<Job> {
        // Check if corresponding ID is an enterprise
        const user = await this.userRepo.get(job.enterpriseId);
        if (user.acctype !== AccType.ENTERPRISE) {
            throw new InvalidFieldException(`The provided enterpriseId for the job does not correspond to an enterprise!`, [{
                fieldName: 'job.enterpriseId',
                type: 'number'
            }]);
        }

        // TODO: Check salary?

        return await this.jobRepo.insert(job);
    }

    public async get(id: number): Promise<Job> {
        return await this.jobRepo.get(id);
    }

    public async update(job: Job): Promise<Job> {
        return await this.jobRepo.update(job);
    }

    public async delete(id: number): Promise<void> {
        return await this.jobRepo.delete(id);
    }

    public async getByEnterpriseId(enterpriseId: number): Promise<Job[]> {
        return await this.jobRepo.getByEnterpriseId(enterpriseId);
    }

}
