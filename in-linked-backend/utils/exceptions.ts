/* Store basic data for parameter error */
export interface FieldError {
    fieldName: string;
    type: string;
}

/**
 * Store application specific exceptions
 */
export class ExceptionBase extends Error {
    public code: number;
    public error: Error;

    constructor(code: number, message: string, error?: Error | ExceptionBase) {
        super(message);
        this.code = code;
        this.error = error;
    }

    public toObject(): any {
        return {
            message: this.message,
            code: this.code,
            internalError: { ...this.error }
        };
    }
}

export class NotFoundException extends ExceptionBase {
    constructor(msg: string) {
        super(20000, msg);
    }
}

export class ValidationException extends ExceptionBase {
    constructor(msg: string, err?: Error) {
        super(30000, msg, err);
    }
}

export class InvalidFieldException extends ExceptionBase {
    public fields: FieldError[];

    constructor(message: string, fields: FieldError[], error?: Error) {
        super(30001, message, error);
        this.fields = fields;
    }

    public toObject() {
        return {
            code: this.code,
            message: this.message,
            fields: this.fields
        };
    }
}

export class UnauthorizedException extends ExceptionBase {
    constructor(msg: string, err: Error) {
        super(30002, msg, err);
    }
}

export class PermissionException extends ExceptionBase {
    constructor(error?: Error) {
        super(30003, 'Permission denied', error);
    }
}

export class UnauthenticatedException extends ExceptionBase {
    constructor(msg: string) {
        super(40000, msg);
    }
}

export function isError(obj: any): boolean {
    return obj !== undefined && (obj.code !== undefined && obj.success !== undefined);
}