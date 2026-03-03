import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import { Movie } from "../models/Movie";

declare global {
    namespace Express {
        interface Request {
            movie?: Movie
        }
    }
}

export async function validateMovieInput(req: Request, res: Response, next: NextFunction) {
    await body('name')
        .notEmpty().withMessage('El nombre es obligatorio').run(req),
        await body('director')
            .notEmpty().withMessage('El nombre del director es obligatorio').run(req),
        await body('path')
            .notEmpty().withMessage('El path es obligatorio').run(req),
        await body('description')
            .notEmpty().withMessage('La descripción es obligatoria').run(req),
        await body('premiereDate')
            .notEmpty().withMessage('La fecha de estreno es obligatoria').run(req),
        await body('image')
            .notEmpty().withMessage('La imagen de portada es obligatoria').run(req),
        await body('rate')
            .notEmpty().withMessage('La calificación es obligatoria')
            .isNumeric().withMessage('La calificación debe ser un número')
            .custom(value => value > 0).custom(value => value < 10).withMessage('El rate debe ser entre 0 y 10')
            .run(req),
        await body('category_id')
            .notEmpty().withMessage('El category_id es obligatorio')
            .isNumeric().withMessage('El category_id debe ser un número')
            .custom(value => value > 0).withMessage('El category_id debe ser mayor a 0')
            .run(req)
    next()
}

export async function validateMoviePath(req: Request, res: Response, next: NextFunction) {
    await param('moviePath')
        .isString().withMessage('El moviePath debe ser un string')
        .run(req)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

export async function validateMovieQuery(req: Request, res: Response, next: NextFunction) {
    await query('status')
        .custom((value) => value === 'soon' || value === 'premiere' || value === 'screening')
        .optional()
        .withMessage('Valor de status inválido').run(req)
    await query('owner')
        .custom((value) => value === 'me')
        .optional()
        .withMessage('Valor de owner inválido').run(req)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

export async function loadMovieByPath(req: Request, res: Response, next: NextFunction) {
    try {
        const moviePath = req.params.moviePath
        const movie = await Movie.findOne({
            where: { path: moviePath },
            include: ['category']
        })
        if (!movie) {
            const error = new Error('La película no existe')
            return res.status(404).json(error.message)
        }
        req.movie = movie
        next()
    } catch (error) {
        console.log(error)
    }
}

export async function hasMovieAccess(req: Request, res: Response, next: NextFunction) {
    try {
        if(req.movie.creator_id !== req.user.id) {
            const error = new Error('No tiene acceso a este elemento')
            return res.status(401).json({error: error.message})
        }
        next()
    } catch (error) {
        
    }
}

//TODO: DELETE??
export async function ensureOnlyOneFeaturedMovie(req: Request, res: Response, next: NextFunction) {
    try {
        const showHeader = req.body.showHeader
        if (showHeader) {
            const movieHeader = await Movie.findOne({
                where: {
                    showHeader: true
                }
            })
            if (movieHeader) {
                movieHeader.showHeader = false
                await movieHeader.save()
            }
        }
        next()
    } catch (error) {

    }
}
