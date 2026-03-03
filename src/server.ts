import cors from 'cors';
import colors from 'colors'
import express from "express"
import movieRoutes from './routes/movieRoutes'
import sellRoutes from './routes/sellRoutes'
import authRoutes from './routes/authRoutes'
import screeningRoutes from './routes/screeningRoutes'
import seatRoutes from './routes/seatRoutes'
import categoryRoutes from './routes/categoryRoutes'
import { db } from './config/db'
import { seeder } from './seeder/seeder'
import { corsOption } from './config/cors'; 

const app = express()

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.white.bgMagenta('Database connected'))
    } catch (error) {}
}
connectDB()

app.use(express.json())

app.use(cors(corsOption))

app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/screenings', screeningRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/sells', sellRoutes)

app.use('/api/seats', seatRoutes)

app.post('/api/seed',  seeder)


export default app