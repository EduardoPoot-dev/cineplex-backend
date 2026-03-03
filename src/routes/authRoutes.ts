import { authenticate } from './../middlewares/auth';
import Router from "express";
import { body } from "express-validator";
import { AuthController } from "../controller/AuthController";
import { handleInputErrors } from "../middlewares/validation";

const router = Router()

router.get('/authenticate', authenticate, AuthController.user)

router.post('/register',
    body('name')
        .notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('email')
        .isEmail().notEmpty().withMessage('Email no válido'),
    body('password')
        .notEmpty().isLength({ min: 6}).withMessage('El password debe tener mínimo 6 caracteres'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/login',
    body('email')
        .isEmail().notEmpty().withMessage('Email no válido'),
    body('password')
        .notEmpty().isLength({ min: 6}).withMessage('El password debe tener mínimo 6 caracteres'),
    handleInputErrors,
    AuthController.login
)

export default router