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
const errors_1 = require("../utils/errors");
/**
 * Verifies that a particular user is allowed to this action based on the roles allowed for the action and user's roles
 *
 * @export
 * @param {Role[]} roles - list of allowed roles to hit the endpoint
 * @returns - middleware that handles user authorization
 */
function authorization(roles) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body || !req.body.user) {
                throw new exceptions_1.ExceptionBase(10000, 'Missing request body with user role.');
                // res.status(500).send({ body: req.body.user, ext: req.body });
                // return;
            }
            const user = req.body.user;
            // Check if user is able to perform this action
            if (roles.indexOf(user.role) < 0) {
                throw new exceptions_1.PermissionException();
            }
            yield next();
        }
        catch (err) {
            res.status(500).send(errors_1.buildErrorRes(err.toObject()));
        }
    });
}
exports.authorization = authorization;
//# sourceMappingURL=authorization.js.map