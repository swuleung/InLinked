/**
 * Middleware for handling HTTP errors
 * Can be extended to send custom messages back to server
 */
import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';

import * as errors from '../utils/errors';

/**
 * Error response middleware for 404 not found. This middleware function should be at the very bottom of the stack.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 */
export function notFoundError(req: Request, res: Response, next: NextFunction) {
    // eslint-disable-line no-unused-vars
    res.status(HttpStatus.NOT_FOUND).json({
        error: {
            code: HttpStatus.NOT_FOUND,
            message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
        }
    });
}

/**
 * Generic error response middleware for validation and internal server errors.
 *
 *
 * @param {*} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function genericErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // eslint-disable-line no-unused-vars
    if (err.stack) {
        console.log('Error stack trace: ', err.stack);
    }

    const error = errors.buildError(err);
    res.status(error.code).json({ error });
}
