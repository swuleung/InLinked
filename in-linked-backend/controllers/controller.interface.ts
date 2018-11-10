/**
 * Controller interface
 */
import { Application } from 'express';
import { ServiceModule } from '../utils/module/service-module';
export interface IController {
    bindRoutes(app: Application, module: ServiceModule): void;
}