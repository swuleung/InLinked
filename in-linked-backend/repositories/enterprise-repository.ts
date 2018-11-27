import { MySql } from '../utils/lib/database';
import { Enterprise } from '../models';
import { ValidationException, NotFoundException } from '../utils/exceptions';
import { EnterpriseExt } from '../models/enterprise';

export class EnterpriseRepository {
    private readonly TABLE_NAME: string = 'enterprise';
    private db: MySql;

    constructor(db: MySql) {
        this.db = db;
    }

    public async insert(enterprise: Enterprise): Promise<Enterprise> {
        const conn = await this.db.getConnection();
        try {
            const res = await conn.table(this.TABLE_NAME).insert({
                EnterpriseId: enterprise.enterpriseId,
                EnterpriseName: enterprise.enterpriseName,
                EnterpriseDescription: enterprise.enterpriseDescription,
                CEO: enterprise.ceo,
                HeadQuarters: enterprise.headquarters,
                Industry: enterprise.industry
            });

            return enterprise;
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new ValidationException(
                    `The enterprise ${enterprise.enterpriseName} already exists.`,
                    err
                );
            }

            throw err; // Other errors
        }
    }

    public async get(id: number): Promise<Enterprise> {
        const conn = await this.db.getConnection();
        const row = await conn
            .table(this.TABLE_NAME)
            .where({ EnterpriseId: id })
            .first();

        if (!row) {
            throw new NotFoundException(
                `The id '${id}' does not exist in the enterprise table.`
            );
        }
        return this.toModel(row);
    }

    public async update(enterprise: Enterprise): Promise<Enterprise> {
        const conn = await this.db.getConnection();
        await conn.table(this.TABLE_NAME)
            .where({ EnterpriseId: enterprise.enterpriseId })
            .update({
                EnterpriseName: enterprise.enterpriseName,
                EnterpriseDescription: enterprise.enterpriseDescription,
                CEO: enterprise.ceo,
                HeadQuarters: enterprise.headquarters,
                Industry: enterprise.industry
            });
        return enterprise;
    }

    public async delete(id: number): Promise<void> {
        const transaction = await this.db.getTransaction();

        try {
            await transaction.from(this.TABLE_NAME)
                .delete()
                .where({ EnterpriseId: id });
            
            await transaction.commit();
        } catch (err) {
            transaction.rollback(err);
            throw err;
        }
    }

    /* SPECIAL FUNCTION */
    public async fuzzySearchHelper(query: string, columnNames: string[], limit?: number): Promise<EnterpriseExt[]> {
        const enterprises = new Map<number, EnterpriseExt>();
        const conn = await this.db.getConnection();

        for (const column of columnNames) {
            for (const str of query.split(' ')) {
                const rows = await conn.table(this.TABLE_NAME)
                    .innerJoin('User', 'User.UserId', `${this.TABLE_NAME}.EnterpriseId`)
                    .whereRaw(`${column} LIKE '%${str}%'`)
                    .orderByRaw(`
                        ${column} LIKE '${str}%' DESC,
                        IFNULL(NULLIF(INSTR(${column}, ' ${str}'), 0), 99999),
                        IFNULL(NULLIF(INSTR(${column}, '${str}'), 0), 99999),
                        ${column}
                    `)
                    .limit(limit || 30);
                const enterpriseByColArr: EnterpriseExt[] = this.toModelListUser(rows);
                for (const enterprise of enterpriseByColArr) {
                    if (!(enterprise.enterpriseId in [...enterprises.keys()])) {
                        enterprises.set(enterprise.enterpriseId, enterprise);
                    }
                }
            }
        }

        return [...enterprises.values()];
    }

    public toModel(row: any): Enterprise {
        return {
            enterpriseId: row.EnterpriseId,
            enterpriseName: row.EnterpriseName,
            enterpriseDescription: row.EnterpriseDescription,
            ceo: row.CEO,
            headquarters: row.HeadQuarters,
            industry: row.Industry
        };
    }

    public toModelUser(row: any): EnterpriseExt {
        return {
            userId: row.UserId,
            username: row.Username,
            headline: row.Headline,
            email: row.Email,
            profilePicture: row.ProfilePicture,
            coverPhoto: row.CoverPhoto,
            role: row.Role,
            acctype: row.AccType,
            createDate: row.CreateDate,
            lastActiveDate: row.LastActiveUser,
            enterpriseId: row.EnterpriseId,
            enterpriseName: row.EnterpriseName,
            enterpriseDescription: row.EnterpriseDescription,
            ceo: row.CEO,
            headquarters: row.HeadQuarters,
            industry: row.Industry,
        }
    }

    public toModelList(list: any): Enterprise[] {
        return list.map(enterprise => this.toModel(enterprise));
    }

    public toModelListUser(list: any): EnterpriseExt[] {
        return list.map(enterpriseExt => this.toModelUser(enterpriseExt));
    }
}
