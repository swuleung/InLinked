/**
 * Controller interface
 */
import { Application } from 'express';
import { ServiceModule } from '../utils/module/service-module';
export abstract class IController {
    public abstract bindRoutes(app: Application, module: ServiceModule): void;

    /**
     * Build success response object for endpoints
     * 
     * @param {string} message - message to send with
     * @param {*} [data] 
     * @returns {*} 
     * @memberof IController
     */
    public buildSuccessRes(message: string, data?: any): any {
        return { success: 1, message, data }
    }
    
    /**
     * Build error object for endpoints
     * 
     * @param {*} obj - the object that we want to send back
     * @returns - the error response that we have
     * @memberof IController
     */
    public buildErrorRes(obj: any) {
        return { success: 0, data: obj };
    }
}