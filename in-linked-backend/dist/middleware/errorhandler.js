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
// import
const httpErrCodes = {
    10000: 500,
    20000: 404,
    30000: 400,
    30001: 400,
    30002: 401,
    30003: 403
};
/**
 * Middleware for capturing errors during processing actions
 *
 * @export
 * @returns - function callback to handle errors
 */
function errorHandler() {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield next();
        }
        catch (err) {
            if (err instanceof exceptions_1.ExceptionBase) {
                const error = err;
                const code = httpErrCodes[err.code] ? httpErrCodes[err.code] : 500;
                res.status(code).send(error.toObject());
            }
            else {
                res.status(500).send(new exceptions_1.ExceptionBase(10000, 'Internal Error Server').toObject());
            }
        }
    });
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorhandler.js.map