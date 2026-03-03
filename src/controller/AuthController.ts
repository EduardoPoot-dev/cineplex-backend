import type { Request, Response } from 'express'
import User from '../models/User'
import { generateJWT } from '../utils/jwt'
import { hashPassword, checkPassword } from '../utils/auth'

export class AuthController {
    static async createAccount(req: Request, res: Response) {

        const { email, password } = req.body

        // Prevenir duplicados
        const userExists = await User.findOne({where: {email}})
        if(userExists) {
            const error = new Error('Un usuario con ese email ya esta registrado')
            return res.status(409).json({error: error.message})
        }
        
        try {
            const user = await User.create(req.body)
            user.password = await hashPassword(password)

            await user.save()
            
            res.status(201).json('Cuenta Creada Correctamente')
        } catch (error) {
            // console.log(error)
            res.status(500).json({error: 'Hubo un error'})
        }
    } 

    static async login(req: Request, res: Response) {
        const { email, password } = req.body

        // Revisar que el usuario exista
        const user = await User.findOne({where:{email}})
        if(!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({error: error.message})
        }

        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Password Incorrecto')
            return res.status(401).json({error: error.message})
        }
        
        const token = generateJWT(user.id)
        res.json(token)
    }

    static async user(req: Request, res: Response) {
        res.json(req.user)
    }

    static async updateCurrentUserPassword(req: Request, res: Response) {
        const { current_password, password } = req.body
        const { id } = req.user

        const user = await User.findByPk(id)
        
        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('El password actual es incorrecto')
            return res.status(401).json({error: error.message})
        }
        user.password = await hashPassword(password)
        await user.save()

        res.json('El password se modificó correctamente')
    }
}