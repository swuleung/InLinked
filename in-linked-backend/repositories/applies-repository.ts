import { MySql } from '../utils/lib/database';
import { Applies } from '../models/applies';
import { ValidationException, NotFoundException } from '../utils/exceptions';

export class AppliesRepository {
    private readonly TABLE_NAME: string = 'applies';
    private db: MySql;

    constructor(db: MySql) {
        this.db = db;
    }

    public async insert(applies: Applies): Promise<Applies> {
        const conn = await this.db.getConnection();
        try {
            const res = await conn.table(this.TABLE_NAME).insert({
                JobId: applies.jobId,
                CandidateId: applies.candidateId,
                DateApplied: applies.dateApplied
            });
            return applies;
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new ValidationException(
                    `The application where user id ${applies.candidateId} applied to job id ${applies.jobId} already exists.`,
                    err
                );
            }

            throw err; // Other errors
        }
    }

    public async get(jobId: number, candidateId: number): Promise<Applies> {
        const conn = await this.db.getConnection();
        const row = await conn
            .table(this.TABLE_NAME)
            .where({ JobId: jobId, CandidateId: candidateId })
            .first();

        if (!row) {
            throw new NotFoundException(
                `The job Id '${jobId}' and candidate id '${candidateId}' does not exist in the candidates table.`
            );
        }

        return this.toModel(row);
    }

    public async update(applies: Applies): Promise<Applies> {
        const conn = await this.db.getConnection();
        await conn.table(this.TABLE_NAME)
            .where({ JobId: applies.jobId, CandidateId: applies.candidateId })
            .update({
                jobId: applies.jobId,
                candidateId: applies.candidateId,
                dateApplied: applies.dateApplied
            });
        return applies;
    }

    public async delete(id: number): Promise<void> {
        const transaction = await this.db.getTransaction();

        try {
            await transaction.from(this.TABLE_NAME)
                .delete()
                .where({ CandidateId: id });
        } catch (err) {
            // Error in transaction, roll back
            transaction.rollback(err);
            throw err;
        }
    }

    public toModel(row: any): Applies {
        return {
            jobId: row.JobId,
            candidateId: row.CandidateId,
            dateApplied: row.DateApplied
        }
    }
}
