import { Request, Response } from "express";
import { Screening } from "../models/Screening";
import { Op } from "sequelize";

export class ScreeningController {
    static async getScreeningsByMovie(req: Request, res: Response) {
        try {
            let options 
            const { status } = req.query
            
            if (status === 'active') {
                options = {
                    date: {
                        [Op.gt]: new Date()
                    }
                }
            }
            console.log(options)
            const screenings = await Screening.findAll({
                where: {
                    ...options,
                    movie_id: req.movie.id,
                }
            })
            res.json(screenings)
        }
        catch (error) {
            console.log(error)

        }
    }

    static async getScreeningById(req: Request, res: Response) {
        try {
            res.json(req.screening)
        } catch (error) {
            
        }
    }

    static async newScreening(req: Request, res: Response) {
        try {
            const { screenings } = req.body
            for (const screening of screenings) {
                screening.movie_id = req.movie.id
                req.movie.hasScreenings = true
                await req.movie.save()
                const newScreening = new Screening(screening)
                newScreening.creator_id = req.user.id
                newScreening.save()
            }
            res.status(201).json(`${screenings.length > 1 ? 'Funciones creadas' : 'Función creada'} correctamente`)
        } catch (error) {

        }
    }

    static async editScreening(req: Request, res: Response) {
        try {
            const { date, price } = req.body
            req.screening.date = date
            req.screening.price = +price 
            await req.screening.save()
            res.json('Función actualizada correctamente')
        } catch (error) {
            console.log(error)
        }
    }

}