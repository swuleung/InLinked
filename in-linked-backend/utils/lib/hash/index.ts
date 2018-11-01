/**
 * Wrapper for password hasing
 */
import * as bcrypt from 'bcryptjs';

export interface IHash {
    hashPassword(pass: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
}

export class BCryptHash implements IHash {
    /**
     * Hash a given password using a salt generated with 10 rounds
     * 
     * @param {string} password - the password to hash
     * @returns {Promise<string>} - returns promise containing the hash
     * @memberof BCryptHash
     */
    public async hashPassword(password: string): Promise<string> {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hash(password, salt);
    }

    /**
     * Verify a given password with a hash
     * 
     * @param {string} password - password to verify
     * @param {string} hash - hash to compare with
     * @returns {Promise<boolean>} - returns promise containing boolean for 
     * @memberof BCryptHash
     */
    public async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}