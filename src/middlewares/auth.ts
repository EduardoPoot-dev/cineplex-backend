import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
        if(!bearer) {
            const error = new Error('No Autorizado')
            return res.status(401).json({error: error.message})
        }

        const [ , token] = bearer.split(' ')
        if(!token) {
            const error = new Error('Token no válido')
            return res.status(401).json({error: error.message})
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            if(typeof decoded === 'object' && decoded.id) {
                const user = await User.findByPk(decoded.id, {
                    attributes: ['id', 'name', 'email', 'isAdmin']
                })

                if(!user) {
                    const error = new Error('Usuario no encontrado')
                    return res.status(404).json({error: error.message})
                }

                req.user = user
                
                next()
            }
        } catch (error) {
            res.status(500).json({error: 'Token no válido'})
        }

}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {isAdmin} =req.user
        if(!isAdmin) {
            const error = new Error('Debes ser administrador para realizar esta accion')
            return res.status(409).json({error: error.message})
        }
        next()
    } catch (error) {
        console.log(error)
    }
}