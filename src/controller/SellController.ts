import { Request, Response } from "express";
import { Screening } from "../models/Screening";
import { db } from "../config/db";
import { Sell } from "../models/Sell";
import { SeatSell } from "../models/SeatSell";
import { Seat } from "../models/Seat";
import { Op } from "sequelize";

export class SellController {
    static async getSells(req: Request, res: Response) {
        const date = new Date()
        const { status } = req.query
        let screeningOptions = {}

        try {
            if (status === 'expired') {
                screeningOptions = {
                    date: {
                        [Op.lt]: date
                    }
                }
            }
            if (status === 'actived') {
                screeningOptions = {
                    date: {
                        [Op.gt]: date
                    }
                }
            }

            const sell = await Sell.findAll({
                where: {
                    user_id: req.user.id
                },
                order: [['id', 'DESC']],
                include: [
                    {
                        association: 'seatsSells'
                    },
                    {
                        association: 'screening',
                        where: {
                            ...screeningOptions
                        },
                        include: [
                            {
                                association: 'movie',
                                include: ['category']
                            }
                        ]
                    }
                ]
            })
            res.json(sell)
        } catch (error) {

        }
    }

    static async newSell(req: Request, res: Response) {
        try {
            await db.transaction(async (t) => {
                const { screeningId } = req.params
                const screening = await Screening.findByPk(+screeningId, {
                    transaction: t,
                    lock: t.LOCK.UPDATE
                })

                const { seats } = req.body
                const seatNames = seats.map(s => s.name)

                if (screening.seatsQuantity < seats.length) {
                    const error = new Error('No hay asientos para esa función')
                    return res.status(409).json({error: error.message})
                }

                const soldSeats = await SeatSell.findAll({
                    where: {
                        name: seatNames,
                        screening_id: screening.id
                    },
                    transaction: t,
                    lock: t.LOCK.UPDATE
                })

                if (soldSeats.length > 0) {
                    const error = new Error('Asientos ocupados')
                    return res.status(409).json({error: error.message})
                }

                const sell = await Sell.create({
                    screening_id: screening.id,
                    user_id: req.user.id,
                    total: seats.length * screening.price
                }, { transaction: t })

                await SeatSell.bulkCreate(
                    seats.map(seat => ({
                        name: seat.name,
                        screening_id: screening.id,
                        sell_id: sell.id
                    })),
                    { transaction: t }
                )

                screening.seatsQuantity -= seats.length
                await screening.save({ transaction: t })

            })

            res.status(201).json('Compra hecha correctamente')
        } catch (error) {
            console.log(error)
        }
    }
}