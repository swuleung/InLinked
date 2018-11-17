import { MySql } from '../utils/lib/database';
import { Experience } from '../models/experience';
import { ValidationException, NotFoundException } from '../utils/exceptions';

/**
 * CRUD functionality directly interfacing with the database
 *
 * @export
 * @class ExperienceRepository
 */
export class ExperienceRepository {
    private readonly TABLE_NAME: string = 'experience';
    private db: MySql;

    constructor(db: MySql) {
        this.db = db;
    }

    /* CRUD */
    public async insert(experience: Experience): Promise<Experience> {
        const conn = await this.db.getConnection();

        try {
            const res = await conn.table(this.TABLE_NAME).insert({
                UserId: experience.userId,
                ExerpriseId: experience.enterpriseId,
                EnterpriseName: experience.enterpriseName,
                PositionName: experience.positionName,
                Description: experience.description,
                StartMonth: experience.startMonth,
                StartYear: experience.startYear,
                EndMonth: experience.endMonth,
                EndYear: experience.endYear,
                Location: experience.location
            });
            experience.experienceId = res[0];
            return experience;
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new ValidationException(
                    `Experience with id ${ experience.experienceId } already exists`,
                    err
                );
            }

            throw err; // Other errors
        }
    }

    public async get(id: number): Promise<Experience> {
        const conn = await this.db.getConnection();
        const row = await conn
            .table(this.TABLE_NAME)
            .where({ ExperienceId: id })
            .first();

        if (!row) {
            throw new NotFoundException(
                `The id '${id}' does not exist in the experience table.`
            );
        }
        return this.toModel(row);
    }

    public async update(experience: Experience): Promise<Experience> {
        const conn = await this.db.getConnection();
        await conn.table(this.TABLE_NAME)
            .where({ ExperienceId: experience.experienceId })
            .update({
                EnterpriseId: experience.enterpriseId,
                EnterpriseName: experience.enterpriseName,
                PositionName: experience.positionName,
                Description: experience.description,
                StartMonth: experience.startMonth,
                StartYear: experience.startYear,
                EndMonth: experience.endMonth,
                EndYear: experience.endYear,
                Location: experience.location
            });
        return experience;
    }

    public async delete(id: number): Promise<void> {
        const transaction = await this.db.getTransaction();

        try {
            await transaction.from(this.TABLE_NAME)
                .delete()
                .where({ ExperienceId: id });

            await transaction.commit();
        } catch (err) {
            transaction.rollback(err);
            throw err;
        }
    }

    public toModel(row: any): Experience {
        return {
            experienceId: row.ExperienceId,
            userId: row.UserId,
            enterpriseId: row.EnterpriseId,
            enterpriseName: row.EnterpriseName,
            positionName: row.PositionName,
            description: row.Description,
            startMonth: row.StartMonth,
            startYear: row.StartYear,
            endMonth: row.EndMonth,
            endYear: row.EndYear,
            location: row.Location
        }
    }

    public toModelList(list: any): Experience[] {
        // Assuming that the object passed in is a list
        return list.map((r: any) => this.toModel(r));
    }

    /* CUSTOM FUNCTIONS */
    // TODO: NEEDS TESTING
    public async getByUser(userId: number, limit?: number): Promise<Experience[]> {
        const conn = await this.db.getConnection();
        const row = await conn
            .table(this.TABLE_NAME)
            .where({ UserId: userId })
            .orderBy('StartMonth', 'desc')
            .orderBy('StartDate', 'desc')
            .limit(limit || 30);

        if (!row) {
            throw new NotFoundException(
                `The user id ${userId} does not have any experience.`
            );
        }
        return this.toModelList(row);
    }
}
