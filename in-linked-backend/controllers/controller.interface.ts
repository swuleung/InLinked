/**
 * Controller interface
 */
import { Application } from 'express';
export interface IController {
    bindRoutes(app: Application): void;
}