/**
 * CRUD functionality, interface with MySQL
 */
export class UserRepository {
    private readonly TABLE_NAME: string = 'user';
    private db: MySql;

    constructor(db: MySql) {
        this.db = db;
    }

}