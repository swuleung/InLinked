"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../utils/exceptions");
/**
 * CRUD functionality, interface with MySQL
 *
 * @export
 * @class UserRepository
 */
class UserRepository {
    constructor(db) {
        this.TABLE_NAME = 'user';
        this.db = db;
    }
    /**
     * Insert a user object into the database
     *
     * @param {User} user - the user object we want to add
     * @returns {Promise<User>} - returns promise containing the user that we added
     * @memberof UserRepository
     */
    insert(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            try {
                const res = yield conn.table(this.TABLE_NAME).insert({
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
            }
            catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    throw new exceptions_1.ValidationException(`The user ${user.email} already exists.`, err);
                }
                throw err; // Other errors
            }
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            const row = yield conn
                .table(this.TABLE_NAME)
                .where({ UserId: id })
                .first();
            if (!row) {
                throw new exceptions_1.NotFoundException(`The id '${id}' does not exist in the users table.`);
            }
            return this.toModel(row);
        });
    }
    /**
     * Queries the database to find a user by email
     *
     * @param {string} email - email to search in database
     * @returns {Promise<User>} - return promise containing User object
     * @memberof UserRepository
     */
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            const row = yield conn
                .table(this.TABLE_NAME)
                .where({ email })
                .first();
            if (!row) {
                throw new exceptions_1.NotFoundException(`The email '${email}' does not exist in the table.`);
            }
            return this.toModel(row);
        });
    }
    /**
     * Update a user with specific fields only
     * Note that we will only allow for the headline, password, profile picture, and cover photo to be updated
     *
     * @param {User} user
     * @returns {Promise<User>}
     * @memberof UserRepository
     */
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            yield conn.table(this.TABLE_NAME).update({
                Headline: user.headline,
                ProfilePicture: user.profilePicture,
                CoverPhoto: user.coverPhoto
            });
            return user;
        });
    }
    /**
     * Delete user by user id
     *
     * @param {number} userId - id of user to delete
     * @returns {Promise<void>} - return a void promise :(
     * @memberof UserRepository
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.getTransaction();
            try {
                yield transaction.from(this.TABLE_NAME)
                    .delete()
                    .where({ UserId: id });
                yield transaction.commit(); // Commit transaction
            }
            catch (err) {
                // Error in transaction, roll back
                transaction.rollback(err);
                throw err;
            }
        });
    }
    /**
     * Transforms a given row into a User model
     *
     * @param {*} row - row that we are converting
     * @returns {User} - returns a User model that was recently converted
     * @memberof UserRepository
     */
    toModel(row) {
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
    changePassword(email, newPass) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            yield conn.table(this.TABLE_NAME)
                .update({
                Password: newPass
            })
                .where('email', email);
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user-repository.js.map