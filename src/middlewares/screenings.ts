import { Request, Response, NextFunction } from "express";
import { Screening } from "../models/Screening";
import { body, param, validationResult } from "express-validator";

declare global {
    namespace Express {
        interface Request {
            screening?: Screening
        }
    }
}

export async function validateScreeningsInput(req: Request, res: Response, next:NextFunction) {
    await body('screenings')
        .isArray().withMessage('Las funciones debe estar en un array').run(req),
    await body('screenings.*.date')
        .notEmpty().withMessage('La fecha de la funcion es obligatoria').run(req),
    await body('screenings.*.price')
        .notEmpty().isNumeric().withMessage('El precio de la función es obligatorio').run(req),
    next()
}

export async function validateScreeningInput(req: Request, res: Response, next:NextFunction) {
    await body('date')
        .notEmpty().withMessage('La fecha de la funcion es obligatoria').run(req),
    await body('price')
        .notEmpty().isNumeric().withMessage('El precio de la función es obligatorio').run(req),
    next()
}

export async function validateScreeningId(req: Request, res: Response, next: NextFunction) {
    await param('screeningId')
        .isNumeric().withMessage('El screeningId debe ser un número')
        .custom(value => value > 0 ).withMessage('El screeningId debe ser mayor a 0')
        .run(req)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    next()
}

export const loadScreeningById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { screeningId } = req.params
        const screening = await Screening.findByPk(+screeningId)
        if(!screening) {
            const error = new Error('Función no encontrada')
            return res.status(404).json({error: error.message})
        }
        req.screening = screening
        next()
    } catch (error) {
        console.log(error)
    }
}

export async function hasScreeningAccess(req: Request, res: Response, next: NextFunction) {
    try {
        if(req.screening.creator_id !== req.user.id) {
            const error = new Error('No tiene acceso a este elemento')
            return res.status(401).json({error: error.message})
        }
        next()
    } catch (error) {
        
    }
}