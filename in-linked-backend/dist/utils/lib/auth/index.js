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
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["ADMIN"] = "admin";
})(Role = exports.Role || (exports.Role = {}));
/**
 * Authentication class used for authenticating different users and assinging tokens for a certain duration
 *
 * @export
 * @class JWTAuth
 * @implements {Auth}
 */
class JWTAuth {
    constructor(repo) {
        this.repo = repo;
        const keys = path.join(__dirname, '..', '..', '..', 'config');
        this.public = fs.readFileSync(`${keys}/public.key`, 'utf8').toString();
        this.secret = fs.readFileSync(`${keys}/private.key`, 'utf8').toString();
    }
    /**
     * Authenticate a user by generating a token associated to it with an experiation time
     *
     * @param {User} user - user to authenticate
     * @returns {string} - returns a jwt for that specific user to use for authentication
     * @memberof JWTAuth
     */
    authenticate(user) {
        return jwt.sign({
            id: user.userId,
            email: user.email,
            role: user.role,
            success: 1
        }, this.secret, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        });
    }
    /**
     * Validate a given user with a user defined token.
     * Will throw an exception if there is no match.
     * User object from db is returned if there is no discrepency
     *
     * @param {string} token - token passed in by the client
     * @returns {Promise<IUser>} - promise containing the IUser that can be used to retrieve other data
     * @memberof JWTAuth
     */
    validate(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            const decode = jwt.verify(token, this.public, { algorithms: ['RS256'] }); // Verify that the given token is a valid token
            const user = yield this.repo.findByEmail(decode.email);
            return {
                userId: user.id,
                email: user.email,
                role: user.role
            };
            // } catch (err) {
            //     throw new UnauthorizedException(
            //         'User is unauthorized to access application data.',
            //         err
            //     );
            // }
        });
    }
}
exports.JWTAuth = JWTAuth;
//# sourceMappingURL=index.js.map