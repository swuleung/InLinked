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
 * Manages user account data before sending to repository
 */
class UserManager {
    constructor(repo, auth, hash) {
        this.repo = repo;
        this.auth = auth;
        this.hash = hash;
    }
    /* CRUD */
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Hash passwords before creating user
            try {
                const hashedPass = yield this.hash.hashPassword(user.password);
                user.password = hashedPass; // Update password
                return this.repo.insert(user);
            }
            catch (ex) {
                return Object.assign({}, ex.toObject(), { success: 0 });
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.repo.findByEmail(email);
            }
            catch (ex) {
                return Object.assign({}, ex.toObject(), { success: 0 });
            }
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.update(user);
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.delete(userId);
        });
    }
    /* Specific functionality */
    /**
     * Update a user's password after verifying user credentials
     *
     * @param {string} email - the email of the user
     * @param {string} newPassword - new password to update to
     * @param {string} oldPassword - old password to update to
     * @returns {Promise<void>}
     * @memberof UserManager
     */
    changePassword(email, newPassword, oldPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repo.findByEmail(email);
            const validPassword = yield this.hash.verifyPassword(oldPassword, user.password); // Check for correct password first
            if (!validPassword) {
                throw new exceptions_1.ValidationException('Old password is incorrect.');
            }
            // Verify the password
            const hashedPass = yield this.hash.hashPassword(newPassword);
            return this.repo.changePassword(email, hashedPass);
        });
    }
    /**
     * Log a user in by verifying their credentials and then authorizing them to the server
     * Return auth token for access.
     *
     * @param {string} email - email of the user to authorize
     * @param {string} password - password of the user
     * @returns {Promise<string>} - return a JWT to the user
     * @memberof UserManager
     */
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.repo.findByEmail(email);
                if (yield this.hash.verifyPassword(password, user.password)) {
                    const val = this.auth.authenticate(user); // Return token for auth
                    this.auth.validate(val);
                    return val;
                }
                throw new exceptions_1.ValidationException('Wrong credentials');
            }
            catch (ex) {
                const pass = yield this.hash.hashPassword(password);
                return Object.assign({}, ex.toObject(), { test: pass, success: 0 }); // Use success code to determine if we can read token
                // TODO: remove
            }
        });
    }
}
exports.UserManager = UserManager;
//# sourceMappingURL=user-manager.js.map