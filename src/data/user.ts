import dotenv from 'dotenv'
dotenv.config()

export const users = [
    {
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.CLOUDINARY_SECRET,
        isAdmin: true
    }
]