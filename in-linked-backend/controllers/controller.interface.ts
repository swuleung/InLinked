/**
 * Controller interface
 */
import { Application } from 'express';
export interface IController {
    bindRoute(app: Application): void;
}