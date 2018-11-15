import { MySql } from '../utils/lib/database';
import { User } from '../models';
import { NotFoundException, ValidationException } from '../utils/exceptions';

/**
 * CRUD functionality, interface with MySQL
 * 
 * @export
 * @class UserRepository
 */
export class UserRepository {
    private readonly TABLE_NAME: string = 'user';
    private db: MySql;

    constructor(db: MySql) {
        this.db = db;
    }

    /**
     * Insert a user object into the database
     *
     * @param {User} user - the user object we want to add
     * @returns {Promise<User>} - returns promise containing the user that we added
     * @memberof UserRepository
     */
    public async insert(user: User): Promise<User> {
        const conn = await this.db.getConnection();
        try {
            const res = await conn.table(this.TABLE_NAME).insert({
                Username: user.username,
                Headline: user.headline,
                Password: user.password,
                Email: user.email,
                ProfilePicture: user.profilePicture,
                CoverPhoto: user.coverPhoto,
                Role: user.role,
                AccType: user.acctype
            });

            user.userId = res[0];
            return user;
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new ValidationException(
                    `The user ${user.email} already exists.`,
                    err
                );
            }

            throw err; // Other errors
        }
    }

    public async get(id: number): Promise<User> {
        const conn = await this.db.getConnection();
        const row = await conn
            .table(this.TABLE_NAME)
            .where({ UserId: id })
            .first();

        if (!row) {
            throw new NotFoundException(
                `The id '${id}' does not exist in the users table.`
            );
        }
        return this.toModel(row);
    }

    /**
     * Queries the database to find a user by email
     *
     * @param {string} email - email to search in database
     * @returns {Promise<User>} - return promise containing User object
     * @memberof UserRepository
     */
    public async findByEmail(email: string): Promise<User> {
        const conn = await this.db.getConnection();
        const row = await conn
            .table(this.TABLE_NAME)
            .where({ email })
            .first();

        if (!row) {
            throw new NotFoundException(
                `The email '${email}' does not exist in the table.`
            );
        }
        return this.toModel(row);
    }

    /**
     * Update a user with specific fields only
     * Note that we will only allow for the headline, password, profile picture, and cover photo to be updated
     *
     * @param {User} user
     * @returns {Promise<User>}
     * @memberof UserRepository
     */
    public async update(user: User): Promise<User> {
        const conn = await this.db.getConnection();
        await conn.table(this.TABLE_NAME)
            .where({ UserId: user.userId })
            .update({
            Headline: user.headline,
            ProfilePicture: user.profilePicture,
            CoverPhoto: user.coverPhoto
        });
        return user;
    }

    /**
     * Delete user by user id
     * 
     * @param {number} userId - id of user to delete
     * @returns {Promise<void>} - return a void promise :(
     * @memberof UserRepository
     */
    public async delete(id: number): Promise<void> {
        const transaction = await this.db.getTransaction();

        try {
            await transaction.from(this.TABLE_NAME)
                .delete()
                .where({ UserId: id });

            await transaction.commit(); // Commit transaction
        } catch (err) {
            // Error in transaction, roll back
            transaction.rollback(err);
            throw err;
        }
    }

    /**
     * Transforms a given row into a User model
     * 
     * @param {*} row - row that we are converting
     * @returns {User} - returns a User model that was recently converted
     * @memberof UserRepository
     */
    public toModel(row: any): User {
        return {
            userId: row.UserId,
            username: row.Username,
            headline: row.Headline,
            password: row.Password,
            email: row.Email,
            profilePicture: row.ProfilePicture,
            coverPhoto: row.CoverPhoto,
            role: row.Role,
            acctype: row.AccType
        };
    }

    /* MORE SPECIFIC CASES */
    /**
     * Update a password by the email
     * 
     * @param {string} email - email of user that we are modifying the password
     * @param {string} newPass - new password for the user
     * @returns {Promise<void>} - returns a promise containing a void
     * @memberof UserRepository
     */
    public async changePassword(email: string, newPass: string): Promise<void> {
        const conn = await this.db.getConnection();
        await conn.table(this.TABLE_NAME)
            .update({
                Password: newPass
            })
            .where('email', email);
    }
}
