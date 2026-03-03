import { Request, Response } from 'express'
import { SeatSell } from '../models/SeatSell'

export class SeatController {
    static async newSellSeat(req: Request, res: Response) {
        try {
            const { screeningId: screening_id } = req.params
            Object.assign(req.body, {screening_id})
           await SeatSell.create(req.body)
            res.send('asiento comprado')
        } catch (error) {
            console.log(error)
        }
    }

    static async getOccupiedSeatsByScreening(req: Request, res: Response) {
        try {
            const { screeningId } = req.params
            const occupiedSeats = await SeatSell.findAll({
                where: {
                    screening_id: +screeningId
                }
            })
            res.json(occupiedSeats)
        } catch (error) {
            console.log(error)
        }
    }
}