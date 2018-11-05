"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Store application specific exceptions
 */
class ExceptionBase extends Error {
    constructor(code, message, error) {
        super(message);
        this.code = code;
        this.error = error;
    }
    toObject() {
        return {
            message: this.message,
            code: this.code,
            error: this.error
        };
    }
}
exports.ExceptionBase = ExceptionBase;
class NotFoundException extends ExceptionBase {
    constructor(msg) {
        super(100, msg);
    }
}
exports.NotFoundException = NotFoundException;
class ValidationException extends ExceptionBase {
    constructor(msg, err) {
        super(200, msg, err);
    }
}
exports.ValidationException = ValidationException;
class UnauthorizedException extends ExceptionBase {
    constructor(msg, err) {
        super(300, msg, err);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class PermissionException extends ExceptionBase {
    constructor(error) {
        super(301, 'Permission denied', error);
    }
}
exports.PermissionException = PermissionException;
//# sourceMappingURL=exceptions.js.map