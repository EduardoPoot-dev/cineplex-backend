import Router from "express";
import { MovieController } from "../controller/MovieController";
import { handleInputErrors } from "../middlewares/validation";
import { validateMoviePath, validateMovieInput, validateMovieQuery, loadMovieByPath, hasMovieAccess} from "../middlewares/movies";
import { authenticate, isAdmin } from "../middlewares/auth";

const router = Router()

router.param('moviePath', validateMoviePath)
router.param('moviePath', loadMovieByPath)

router.get('/', 
    validateMovieQuery,
    handleInputErrors,
    MovieController.getMovies
)

router.get('/admin', 
    authenticate,
    isAdmin,
    MovieController.getCreatedMovies
)

router.get('/:moviePath', 
    MovieController.getMovieByPathname
)

router.post('/', 
    validateMovieInput,
    handleInputErrors,
    authenticate,
    isAdmin,
    MovieController.newMovie
)

router.put('/:moviePath',
    validateMovieInput,
    handleInputErrors,
    authenticate,
    isAdmin,
    hasMovieAccess,
    MovieController.updateMovie
)

router.post('/upload-image', MovieController.uploadImage)

router.get('/header', MovieController.getMovieHeader)

export default router