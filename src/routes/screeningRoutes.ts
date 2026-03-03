import Router from "express";
import { handleInputErrors } from "../middlewares/validation";
import { authenticate, isAdmin } from "../middlewares/auth";
import { validateMoviePath, loadMovieByPath } from "../middlewares/movies";
import { ScreeningController } from "../controller/ScreeningController";
import { loadScreeningById, validateScreeningId, validateScreeningsInput, validateScreeningInput, hasScreeningAccess } from "../middlewares/screenings";

const router = Router()

router.param('moviePath', validateMoviePath)
router.param('moviePath', loadMovieByPath)

router.param('screeningId', validateScreeningId)
router.param('screeningId', loadScreeningById)

router.get('/movie/:moviePath', ScreeningController.getScreeningsByMovie)

router.get('/:screeningId', ScreeningController.getScreeningById)

router.post('/movie/:moviePath',
    validateScreeningsInput,
    handleInputErrors,
    authenticate,
    isAdmin,
    ScreeningController.newScreening
)

router.put('/:screeningId',
    validateScreeningInput,
    handleInputErrors,
    authenticate,
    isAdmin,
    hasScreeningAccess,
    ScreeningController.editScreening
)

export default router