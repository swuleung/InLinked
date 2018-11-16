import { Job } from '../models';
import { MySql } from '../utils/lib/database';
import { connect } from 'http2';
import { ValidationException, NotFoundException } from '../utils/exceptions';

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
        const conn = await this.db.getConnection();

        try {
            const res = await conn.table(this.TABLE_NAME).insert({
                JobId: job.jobId,
                EnterpriseId: job.enterpriseId,
                JobTitle: job.jobTitle,
                JobDescription: job.jobDescription,
                Salary: job.salary,
                EmploymentType: job.employmentType,
                ExperienceLevel: job.experienceLevel,
                EducationLevel: job.educationLevel,
                City: job.city,
                Province: job.province,
                Country: job.country
            });
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new ValidationException(
                    `Job with id ${ job.jobId } already exists`,
                    err
                );
            }

            throw err; // Other errors
        }
    }

    public async get(id: number): Promise<Job> {
        const conn = await this.db.getConnection();
        const row = await conn
            .table(this.TABLE_NAME)
            .where({ ExperienceId: id })
            .first();

        if (!row) {
            throw new NotFoundException(
                `The id '${id}' does not exist in the jobs table.`
            );
        }
        return this.toModel(row);
    }

    public async update(job: Job): Promise<Job> {
        const conn = await this.db.getConnection();
        await conn.table(this.TABLE_NAME)
            .where({ JobId: job.jobId })
            .update({
                JobTitle: job.jobTitle,
                JobDescription: job.jobDescription,
                Salary: job.salary,
                EmploymentType: job.employmentType,
                ExperienceLevel: job.experienceLevel,
                EducationLevel: job.educationLevel,
                City: job.city,
                Province: job.province,
                Country: job.country
            });
        return job;
    }

    public async delete(id: number): Promise<void> {
        const transaction = await this.db.getTransaction();
        
        try {
            await transaction.from(this.TABLE_NAME)
                .delete()
                .where({ JobId: id });
            
            await transaction.commit();
        } catch (err) {
            transaction.rollback();
            throw err;
        }
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
