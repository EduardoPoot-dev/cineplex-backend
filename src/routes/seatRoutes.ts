import Router from "express";
import { SeatController } from "../controller/SeatController";
import { loadScreeningById, validateScreeningId } from "../middlewares/screenings";

const router = Router()

router.param('screeningId', validateScreeningId)
router.param('screeningId', loadScreeningById)

router.get('/screening/:screeningId', SeatController.getOccupiedSeatsByScreening)

router.post('/screening/:screeningId', SeatController.newSellSeat)

export default router