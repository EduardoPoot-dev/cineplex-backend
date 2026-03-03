import cloudinary from "../config/cloudinary"
import formidable from "formidable"
import { Request, Response } from "express"
import { Movie } from "../models/Movie"
import { getFutureDate } from "../utils/getFutureDate"
import { Op } from "sequelize"
import { startOfDay } from "date-fns"
import { v4 as uuid } from "uuid"
import { parsePaginationParam } from "../utils"

export class MovieController {
    static async getMovies(req: Request, res: Response) {
        try {
            const { status, take, skip } = req.query
            let options
            const currentDate = startOfDay(new Date())

            if (status === "premiere") {
                const intoSevenDays = startOfDay(getFutureDate(7, currentDate))
                options = {
                    premiereDate: {
                        [Op.between]: [currentDate, intoSevenDays]
                    }
                }
            }
            if (status === "screening") {
                options = {
                    premiereDate: {
                        [Op.lt]: currentDate
                    }
                }
            }
            if (status === "soon") {
                options = {
                    premiereDate: {
                        [Op.gt]: currentDate
                    }
                }
            }

            const movie = await Movie.findAndCountAll({
                where: {
                    ...options,
                },
                include: ['category',],
                order: [['id', 'DESC']],
                distinct: true,
                limit: parsePaginationParam(+take),
                offset: parsePaginationParam(+skip),
            })
            res.json(movie)
        } catch (error) {
            console.log(error)
        }
    }

    static async getCreatedMovies(req: Request, res: Response) {
        try {
            const { take, skip } = req.query
            const movies = await Movie.findAndCountAll({
                where: {
                    creator_id: req.user.id
                },
                include: ['category'],
                limit: parsePaginationParam(+take),
                offset: parsePaginationParam(+skip),
            })
            res.json(movies)
        } catch (error) {
            
        }
    }

    static async getMovieByPathname(req: Request, res: Response) {
        try {
            res.json(req.movie)
        } catch (error) {

        }
    }

    static async newMovie(req: Request, res: Response) {
        try {
            const newMovie = new Movie(req.body)
            newMovie.creator_id = req.user.id
            res.json('Película creada correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    static async updateMovie(req: Request, res: Response) {
        try {
            const { name, description, path, director, premiereDate, image, rate } = req.body
            req.movie.name = name
            req.movie.director = director
            req.movie.description = description
            req.movie.premiereDate = premiereDate
            req.movie.image = image
            req.movie.rate = rate
            req.movie.path = path

            await req.movie.save()

            res.json('Película actualizada correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    static uploadImage(req: Request, res: Response) {
        try {
            const form = formidable({ multiples: false })
            form.parse(req, (error, fields, files) => {
                cloudinary.uploader.upload(files.file[0].filepath, {
                    resource_type: 'image',
                    public_id: uuid()
                })
                    .then((image) => {
                        res.status(201).json(image.secure_url)
                    })
            })
        } catch (error) {
            //console.log(error)
        }
    }

    static async getMovieHeader(req: Request, res: Response) {
        try {
            const movieHeader = await Movie.findOne({
                where: { showHeader: true },
                include: ['categories']
            })
            if (!movieHeader) {
                const error = new Error('No hay película para el header')
                return res.status(404).json({ error: error.message })
            }
            res.json(movieHeader)
        } catch (error) {

        }
    }
}