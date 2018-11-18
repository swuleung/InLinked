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
            internalError: Object.assign({}, this.error)
        };
    }
}
exports.ExceptionBase = ExceptionBase;
class NotFoundException extends ExceptionBase {
    constructor(msg) {
        super(20000, msg);
    }
}
exports.NotFoundException = NotFoundException;
class ValidationException extends ExceptionBase {
    constructor(msg, err) {
        super(30000, msg, err);
    }
}
exports.ValidationException = ValidationException;
class InvalidFieldException extends ExceptionBase {
    constructor(message, fields, error) {
        super(30001, message, error);
        this.fields = fields;
    }
    toObject() {
        return {
            code: this.code,
            message: this.message,
            fields: this.fields
        };
    }
}
exports.InvalidFieldException = InvalidFieldException;
class UnauthorizedException extends ExceptionBase {
    constructor(msg, err) {
        super(30002, msg, err);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class PermissionException extends ExceptionBase {
    constructor(error) {
        super(30003, 'Permission denied', error);
    }
}
exports.PermissionException = PermissionException;
class UnauthenticatedException extends ExceptionBase {
    constructor(msg) {
        super(40000, msg);
    }
}
exports.UnauthenticatedException = UnauthenticatedException;
function isError(obj) {
    return obj !== undefined && (obj.code !== undefined && obj.success !== undefined);
}
exports.isError = isError;
//# sourceMappingURL=exceptions.js.map