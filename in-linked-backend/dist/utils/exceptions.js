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
//# sourceMappingURL=exceptions.js.map