import { Job } from '../models';
import { MySql } from '../utils/lib/database';

/**
 * CRUD functionality for jobs database
 *
 * @export
 * @class JobRepository
 */
export class JobRepository {
    private readonly TABLE_NAME: string = 'job';
    private db: MySql;

    constructor(db: MySql) {
        this.db = db;
    }

    /* CRUD */

    public async insert(job: Job): Promise<Job> {

    }

    public async get(id: number): Promise<Job> {

    }

    public async update(job: Job): Promise<Job> {

    }

    public async delete(id: number): Promise<void> {

    }

    public toModel(row: any): Job {
        return {
            jobId: row.JobId,
            enterpriseId: row.EnterpriseId,
            jobTitle: row.JobTitle,
            jobDescription: row.JobDescription,
            salary: row.Salary,
            employmentType: row.EmploymentType,
            experienceLevel: row.ExperienceLevel,
            educationLevel: row.EducationLevel,
            city: row.City,
            province: row.Province,
            country: row.Country
        };
    }
}
