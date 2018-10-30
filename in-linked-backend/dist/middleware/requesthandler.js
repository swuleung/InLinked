"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status-codes");
const errors = require("../utils/errors");
/**
 * Error response middleware for 404 not found. This middleware function should be at the very bottom of the stack.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 */
function notFoundError(req, res, next) {
    res.status(HttpStatus.NOT_FOUND).json({
        error: {
            code: HttpStatus.NOT_FOUND,
            message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
        }
    });
}
exports.notFoundError = notFoundError;
/**
 * Generic error response middleware for validation and internal server errors.
 *
 *
 * @param {*} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function genericErrorHandler(err, req, res, next) {
    // eslint-disable-line no-unused-vars
    if (err.stack) {
        console.log('Error stack trace: ', err.stack);
    }
    const error = errors.buildError(err);
    res.status(error.code).json({ error });
}
exports.genericErrorHandler = genericErrorHandler;
//# sourceMappingURL=requesthandler.js.map