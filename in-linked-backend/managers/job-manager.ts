import { Job } from '../models';
import { JobRepository } from '../repositories/job-repository';
import { isError } from '../utils/exceptions';

export class JobManager {
    private repo: JobRepository;

    constructor(repo: JobRepository) {
        this.repo = repo;
    }

    /* CRUD */
    public async create(job: Job): Promise<Job> {
        try {
            return await this.repo.insert(job);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

    public async get(id: number): Promise<Job> {
        try {
            return await this.repo.get(id);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

    public async update(job: Job): Promise<Job> {
        try {
            return await this.repo.update(job);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

    public async delete(id: number): Promise<void> {
        try {
            return await this.repo.delete(id);
        } catch (ex) {
            return (isError(ex) ? ex.toObject() : { ...ex });
        }
    }

}
