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
/**
 * Wrapper for password hasing
 */
const bcrypt = require("bcryptjs");
class BCryptHash {
    /**
     * Hash a given password using a salt generated with 10 rounds
     *
     * @param {string} password - the password to hash
     * @returns {Promise<string>} - returns promise containing the hash
     * @memberof BCryptHash
     */
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = bcrypt.genSaltSync(10);
            return bcrypt.hash(password, salt);
        });
    }
    /**
     * Verify a given password with a hash
     *
     * @param {string} password - password to verify
     * @param {string} hash - hash to compare with
     * @returns {Promise<boolean>} - returns promise containing boolean for
     * @memberof BCryptHash
     */
    verifyPassword(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.compare(password, hash);
        });
    }
}
exports.BCryptHash = BCryptHash;
//# sourceMappingURL=index.js.map