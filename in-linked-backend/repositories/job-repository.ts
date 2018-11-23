import { Job } from '../models';
import { MySql } from '../utils/lib/database';
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
                EnterpriseId: job.enterpriseId,
                JobTitle: job.jobTitle,
                JobDescription: job.jobDescription,
                Salary: job.salary,
                EmploymentType: job.employmentType,
                ExperienceLevel: job.experienceLevel,
                EducationLevel: job.educationLevel,
                City: job.city,
                Province: job.province,
                Country: job.country,
                JobURL: job.jobUrl,
                PostedDate: job.postedDate
            });
            job.jobId = res[0];
            return job;
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
            .where({ JobId: id })
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
                Country: job.country,
                JobURL: job.jobUrl
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

    /* SPECIAL FUNCTIONS */
    /**
     * Get all the jobs posted by an enterprise
     *
     * @param {number} enterpriseId
     * @param {number} [limit]
     * @returns {Promise<Job[]>}
     * @memberof JobRepository
     */
    public async getByEnterpriseId(enterpriseId: number, limit?: number): Promise<Job[]> {
        const conn = await this.db.getConnection();
        const rows = await conn
            .table(this.TABLE_NAME)
            .where({ EnterpriseId: enterpriseId })
            .orderBy('JobId', 'desc') // Get most recently posted jobs
            .limit(limit || 50);

        if (!rows) {
            throw new NotFoundException(
                `The enterprise id ${enterpriseId} did not post any jobs.`
            );
        }
        return this.toModelList(rows);
    }

    /**
     * Employ a fuzzy search mechanism to look a job up with matching names, qualifications, employment types and locations
     *
     * @param {string} query
     * @returns {Promise<Job[]>}
     * @memberof JobRepository
     */
    public async fuzzySearchHelper(query: string, columnNames: string[]): Promise<Job[]> {
        const jobs = new Map<number, Job>();
        const conn = await this.db.getConnection();

        // Iterate over all column names we want to check with given strings
        for (const column of columnNames) {
            const rows = await conn.table(this.TABLE_NAME)
                .where({ column: `%${query}%` })
                .orderByRaw(`
                    ${column} LIKE '${query}%' DESC,
                    IFNULL(NULLIF(INSTR(${column}, ' ${query}), 0), 99999),
                    IFNULL(NULLIF(INSTR(${column}, '${query}'), 0), 99999),
                    ${column}
                `);
            let jobsArr: Job[] = this.toModelList(rows);
            for (let job of jobsArr) {
                if (!(job.jobId in jobs.keys())) {
                    // Insert
                }
            }
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
            country: row.Country,
            jobUrl: row.JobURL,
            postedDate: row.PostedDate
        };
    }

    public toModelList(list: any): Job[] {
        return list.map((job: any) => this.toModel(job));
    }
}
