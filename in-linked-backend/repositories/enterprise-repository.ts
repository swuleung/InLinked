import { MySql } from '../utils/lib/database';

export class EnterpriseRepository {
    private readonly TABLE_NAME: string = 'candidate';
    private db: MySql;

    constructor(db: MySql) {
        this.db = db;
    }

    public async insert(candidate: Candidate): Promise<Candidate> {}

    public async get(id: number): Promise<Candidate> {}

    public async update(candidate: Candidate): Promise<Candidate> {}

    public async delete(id: number): Promise<void> {}

    public toModel(row: any): Candidate {
        return {
            candidateId: row.CandidateId,
            fullName: row.FullName,
            skills: row.Skills,
            experience: row.Experience,
            educationLevel: row.EducationLevel
        };
    }
}
