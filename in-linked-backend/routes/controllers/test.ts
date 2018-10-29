/**
 * Test controller
 * PLEASE TEST ME
 */

import { Request, Response } from 'express';

/* Import services being used */

export function getTestMessage(req: Request, res: Response): void {
    const result = 'test';
    res.json(result);
}