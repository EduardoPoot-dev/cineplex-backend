import { screenings } from './../data/screenings';
import { Request, Response } from "express"
import { Seat } from "../models/Seat"
import { seats } from "../data/seats"
import { movies } from "../data/movies"
import { Movie } from "../models/Movie"
import { Screening } from "../models/Screening"
import { categories } from "../data/categories"
import { Category } from "../models/Category"
import User from '../models/User';
import { users } from '../data/user';
import { hashPassword } from '../utils/auth';

export async function seeder(req: Request, res: Response) {
    try {
        await User.truncate({ cascade: true, restartIdentity: true })
        await Movie.truncate({ cascade: true, restartIdentity: true })
        await Category.truncate({ cascade: true, restartIdentity: true })
        await Seat.truncate({ cascade: true, restartIdentity: true })
        await Screening.truncate({ cascade: true, restartIdentity: true })

        for (const user of users) {
            const test1 = await User.create(user)
            test1.password = await hashPassword(test1.password)

            await test1.save()
        }
        for (const category of categories) {
            await Category.create(category)
        }
        for (const movie of movies) {
            await Movie.create(movie)
        }
        for (const seat of seats) {
            await Seat.create(seat)
        }
        for (const screening of screenings) {
            await Screening.create(screening)
        }
        res.send('Seed complete')
    } catch (error) {
        console.log(error)
    }
}
/**
 * 
 * 
 * 
        await Category.destroy({where: {}, cascade: true, restartIdentity: true})
        await CategoryMovie.destroy({where: {}, cascade: true, restartIdentity: true})
        await Seat.destroy({where: {}, cascade: true, restartIdentity: true})
 * for (const movie of movies) {
            await Movie.create(movie)
        }
        for (const category of categories) {
            await Category.create(category)
        }
        for (const seat of seats) {
            await Seat.create(seat)
        }
        for (const item of categoryMovie) {
            await CategoryMovie.create(item)
        }
        res.send('Seed complete')
 */