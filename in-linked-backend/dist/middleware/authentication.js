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
 * Authentication middleware to verify auth token sent by user via headers
 *
 * @export
 * @param {JWTAuth} auth - the auth service used for authentication
 * @returns - A middleware function for authenticating
 */
function authentication(auth) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let token = req.headers.authorization;
        if (!token || token.split(' ')[0] !== 'Bearer') {
            throw new exceptions_1.UnauthenticatedException('User is unauthenticated!');
        }
        else {
            token = token.split(' ')[1];
        }
        const user = yield auth.validate(token);
        req.user = user; // Pass user to subsequent middleware
        yield next();
    });
}
exports.authentication = authentication;
//# sourceMappingURL=authentication.js.map