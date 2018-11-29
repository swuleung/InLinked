import { MySql } from '../utils/lib/database';
import { Candidate, CandidateExt } from '../models';
import { ValidationException, NotFoundException } from '../utils/exceptions';

export class CandidateRepository {
    private readonly TABLE_NAME: string = 'candidate';
    private db: MySql;

    constructor(db: MySql) {
        this.db = db;
    }

    public async insert(candidate: Candidate): Promise<Candidate> {
        const conn = await this.db.getConnection();
        try {
            const res = await conn.table(this.TABLE_NAME).insert({
                CandidateId: candidate.candidateId,
                FullName: candidate.fullName,
                Skills: candidate.skills,
                DisplayEmail: candidate.displayEmail
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
        const conn = await this.db.getConnection();
        const row = await conn
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
        await conn.table(this.TABLE_NAME)
            .where({ CandidateId: candidate.candidateId })
            .update({
                FullName: candidate.fullName,
                Skills: candidate.skills,
                DisplayEmail: candidate.displayEmail
            });
        return candidate;
    }

    public async delete(id: number): Promise<void> {
        const transaction = await this.db.getTransaction();

        try {
            await transaction.from(this.TABLE_NAME)
                .delete()
                .where({ CandidateId: id });

            await transaction.commit();
        } catch (err) {
            // Error in transaction, roll back
            transaction.rollback(err);
            throw err;
        }
    }

    /* SPECIAL FUNCTION */
    public async fuzzySearchHelper(query: string, columnNames: string[], limit?: number): Promise<CandidateExt[]> {
        const candidates = new Map<number, CandidateExt>();
        const conn = await this.db.getConnection();

        for (const column of columnNames) {
            for (const str of query.split(' ')) {
                const rows = await conn.table('User')
                    .innerJoin(this.TABLE_NAME, 'User.UserId', `${this.TABLE_NAME}.CandidateId`)
                    .whereRaw(`${column} LIKE '%${str}%'`)
                    .orderByRaw(`
                        ${column} LIKE '${str}%' DESC,
                        IFNULL(NULLIF(INSTR(${column}, ' ${str}'), 0), 99999),
                        IFNULL(NULLIF(INSTR(${column}, '${str}'), 0), 99999),
                        ${column}
                    `)
                    .limit(limit || 30);
                const candidateByColArr: CandidateExt[] = this.toModelListUser(rows);
                for (const candidate of candidateByColArr) {
                    if (!(candidate.candidateId in [...candidates.keys()])) {
                        candidates.set(candidate.candidateId, candidate);
                    }
                }
            }
        }

        return [...candidates.values()];
    }

    public toModel(row: any): Candidate {
        return {
            candidateId: row.CandidateId,
            fullName: row.FullName,
            skills: row.Skills,
            displayEmail: row.DisplayEmail
        }
    }

    public toModelUser(row: any): CandidateExt {
        return {
            userId: row.UserId,
            username: row.Username,
            headline: row.Headline,
            email: row.Email,
            profilePicture: row.ProfilePicture,
            coverPhoto: row.CoverPhoto,
            role: row.Role,
            acctype: row.AccType,
            candidateId: row.CandidateId,
            fullName: row.FullName,
            skills: row.Skills,
            displayEmail: row.DisplayEmail,
        };
    }

    public toModelList(list: any): Candidate[] {
        return list.map(candidate => this.toModel(candidate));
    }

    public toModelListUser(list: any): CandidateExt[] {
        return list.map(candidateExt => this.toModelUser(candidateExt));
    }
}
