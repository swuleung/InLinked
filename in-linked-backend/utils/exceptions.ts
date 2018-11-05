/**
 * Store application specific exceptions
 */
export class ExceptionBase extends Error {
    public code: number;
    public error: Error;

    constructor(code: number, message: string, error?: Error) {
        super(message);
        this.code = code;
        this.error = error;
    }

    public toObject(): any {
        return {
            message: this.message,
            code: this.code,
            error: this.error
        }
    }
}

export class NotFoundException extends ExceptionBase {
    constructor(msg: string) {
        super(100, msg);
    }
}

export class ValidationException extends ExceptionBase {
    constructor(msg: string, err?: Error) {
        super(200, msg, err);
    }
}

export class UnauthorizedException extends ExceptionBase {
    constructor(msg: string, err: Error) {
        super(300, msg, err);
    }
}

export class PermissionException extends ExceptionBase {
    constructor(error?: Error) {
        super(301, 'Permission denied', error);
    }
}

export class UnauthenticatedException extends ExceptionBase {
    constructor(msg: string) {
        super(400, msg);
    }
}