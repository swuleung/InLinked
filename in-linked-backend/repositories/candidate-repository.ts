import { MySql } from '../utils/lib/database';
import { Candidate } from '../models';
import { ValidationException, NotFoundException } from '../utils/exceptions';

export class CandidateRepository {
    private readonly TABLE_NAME: string = 'candidate';
    private db: MySql;

    constructor(db: MySql) {
        this.db = db;
    }

    public async insert(candidate: Candidate): Promise<Candidate> {
        const connection = await this.db.getConnection();
        try {
            const res = await connection.table(this.TABLE_NAME).insert({
                CandidateId: candidate.candidateId,
                FullName: candidate.fullName,
                Skills: candidate.skills,
                EducationLevel: candidate.educationLevel
            });
            return candidate;
        } catch(err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new ValidationException(
                    `The user ${candidate.candidateId} already exists.`,
                    err
                );
            }

            throw err; // Other errors
        }
    }

    public async get(id: number): Promise<Candidate> {
        const connection = await this.db.getConnection();
        const row = await connection
            .table(this.TABLE_NAME)
            .where({ CandidateId: id })
            .first();

        if (!row) {
            throw new NotFoundException(
                `The id '${id}' does not exist in the candidates table.`
            );
        }
        return this.toModel(row);
    }

    public async update(candidate: Candidate): Promise<Candidate> {
        const conn = await this.db.getConnection();
        await conn.table(this.TABLE_NAME).update({
            FullName: candidate.fullName,
            Skills: candidate.skills,
            EducationLevel: candidate.educationLevel
        });
        return candidate;
    }

    public async delete(id: number): Promise<void> {
        const transaction = await this.db.getTransaction();

        try {
            await transaction.from(this.TABLE_NAME)
                .delete()
                .where({ UserId: id });
        } catch (err) {
            // Error in transaction, roll back
            transaction.rollback(err);
            throw err;
        }
    }

    public toModel(row: any): Candidate {
        return {
            candidateId: row.CandidateId,
            fullName: row.FullName,
            skills: row.Skills,
            educationLevel: row.EducationLevel
        }
    }
}
