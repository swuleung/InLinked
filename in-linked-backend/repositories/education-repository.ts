import { MySql } from '../utils/lib/database';
import { Education } from '../models';
import { ValidationException, NotFoundException } from '../utils/exceptions';

export class EducationRepository {
    private readonly TABLE_NAME: string = 'education';
    private db: MySql;

    constructor(db: MySql) {
        this.db = db;
    }

    /* CRUD */
    public async insert(education: Education): Promise<Education> {
        const conn = await this.db.getConnection();

        try {
            const res = await conn.table(this.TABLE_NAME).insert({
                CandidateId: education.candidateId,
                SchoolName: education.schoolName,
                StartMonth: education.startMonth,
                StartYear: education.startYear,
                EndMonth: education.endMonth,
                EndYear: education.endYear,
                Location: education.location,
                Degree: education.degree
            });
            education.educationId = res[0];
            return education;
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new ValidationException(
                    `Education with id ${ education.educationId } already exists`,
                    err
                );
            }

            throw err; // Other errors
        }
    }

    public async get(id: number): Promise<Education> {
        const conn = await this.db.getConnection();
        const row = await conn
            .table(this.TABLE_NAME)
            .where({ EducationId: id })
            .first();

        if (!row) {
            throw new NotFoundException(
                `The id '${id}' does not exist in the education table.`
            );
        }
        return this.toModel(row);
    }

    public async update(education: Education): Promise<Education> {
        const conn = await this.db.getConnection();
        await conn.table(this.TABLE_NAME)
            .where({ EducationId: education.educationId })
            .update({
                SchoolName: education.schoolName,
                StartMonth: education.startMonth,
                StartYear: education.startYear,
                EndMonth: education.endMonth,
                EndYear: education.endYear,
                Location: education.location,
                Degree: education.degree
            });
        return education;
    }

    public async delete(id: number): Promise<void> {
        const transaction = await this.db.getTransaction();

        try {
            await transaction.from(this.TABLE_NAME)
                .delete()
                .where({ EducationId: id });

            await transaction.commit();
        } catch (err) {
            transaction.rollback(err);
            throw err;
        }
    }

    public toModel(row: any): Education {
        return {
            educationId: row.EducationId,
            candidateId: row.CandidateId,
            schoolName: row.SchoolName,
            startMonth: row.StartMonth,
            startYear: row.StartYear,
            endMonth: row.EndMonth,
            endYear: row.EndYear,
            location: row.Location,
            degree: row.Degree
        };
    }
}
