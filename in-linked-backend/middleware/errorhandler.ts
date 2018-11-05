import { Request, Response } from 'express';
import { ExceptionBase } from '../utils/exceptions';

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
export function errorHandler() {
    return async (req: Request, res: Response, next: () => Promise<any>) => {
        try {
            await next();
        } catch (err) {
            if (err instanceof ExceptionBase) {
                const error: ExceptionBase = err;
                const code: number = httpErrCodes[err.code] ? httpErrCodes[err.code] : 500;
                res.status(code).send(error.toObject());
            } else {
                res.status(500).send(new ExceptionBase(10000, 'Internal Error Server').toObject());
            }
        }
    };
}
