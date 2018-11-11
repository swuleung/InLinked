import { MySql } from '../utils/lib/database';
import { Enterprise } from '../models';

export class EnterpriseRepository {
    private readonly TABLE_NAME: string = 'candidate';
    private db: MySql;

    constructor(db: MySql) {
        this.db = db;
    }

    public async insert(candidate: Enterprise): Promise<Enterprise> {}

    public async get(id: number): Promise<Enterprise> {}

    public async update(candidate: Enterprise): Promise<Enterprise> {}

    public async delete(id: number): Promise<void> {}

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
