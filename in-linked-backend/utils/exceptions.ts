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