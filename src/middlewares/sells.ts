import { Request, Response, NextFunction } from "express";
import { body, query, validationResult } from "express-validator";

export async function validateSellInput(req: Request, res: Response, next: NextFunction) {
    await body('seats')
        .isArray().withMessage('Los asientos deben estar en un arreglo')
        .run(req),
        await body('seats.*.name')
            .notEmpty().withMessage('El nombre del asiento es obligatorio')
            .run(req)
    next()
}

export async function validateSellQuery(req: Request, res: Response, next: NextFunction) {
    query('status')
        .custom((value) => value === 'actived' || value === 'expired')
        .optional().withMessage('Valor inválido')
        .run(req)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}