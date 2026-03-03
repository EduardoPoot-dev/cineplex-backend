import Router from "express";
import { SellController } from "../controller/SellController";
import { authenticate } from "../middlewares/auth";
import { handleInputErrors } from "../middlewares/validation";
import { validateSellInput, validateSellQuery } from "../middlewares/sells";
import { validateScreeningId, loadScreeningById } from "../middlewares/screenings";

const router = Router()

router.use(authenticate)

router.param('screeningId', validateScreeningId)
router.param('screeningId', loadScreeningById)

router.get('/', 
    validateSellQuery,
    SellController.getSells
)

router.post('/screening/:screeningId', 
    validateSellInput,
    handleInputErrors,
    SellController.newSell
)

export default router