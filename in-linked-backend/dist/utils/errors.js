"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generates error objects based on HTTP status
 */
const HttpStatus = require("http-status-codes");
/**
 * Build error response for validation errors.
 *
 * @param  {error} err
 * @return {array | object}
 */
function buildError(err) {
    // Validation errors
    if (err.isJoi || err instanceof SyntaxError) {
        return {
            code: HttpStatus.BAD_REQUEST,
            message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
            details: err.details &&
                err.details.map((error) => {
                    return {
                        message: error.message,
                        param: error.path
                    };
                })
        };
    }
    // HTTP errors
    if (err.isBoom) {
        return {
            code: err.output.statusCode,
            message: err.output.payload.message || err.output.payload.error
        };
    }
    return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
    };
}
exports.buildError = buildError;
/**
 * Build error object for endpoints
 *
 * @param {*} obj - the object that we want to send back
 * @returns - the error response that we have
 * @memberof IController
 */
function buildErrorRes(obj) {
    return { success: 0, data: obj };
}
exports.buildErrorRes = buildErrorRes;
//# sourceMappingURL=errors.js.map