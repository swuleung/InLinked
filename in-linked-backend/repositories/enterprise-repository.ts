import { MySql } from '../utils/lib/database';
import { Enterprise } from '../models';
import { ValidationException, NotFoundException } from '../utils/exceptions';
import { connect } from 'http2';

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

    public toModel(row: any): Enterprise {
        return {
            enterpriseId: row.EnterpriseId,
            enterpriseName: row.EnterpriseName,
            enterpriseDescription: row.EnterpriseDescription,
            ceo: row.CEO,
            headquarters: row.Headquarters,
            industry: row.Industry
        };
    }
}
