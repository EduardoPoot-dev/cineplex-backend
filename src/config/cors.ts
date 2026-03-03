import cors, { CorsOptions } from "cors"

export const corsOption: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [process.env.FRONTEND_URL]

        if(process.argv[2] === '--api') {
            whiteList.push(undefined)
            
        }

        if(whiteList.includes(origin)) {
            callback(null, origin)
        } else {
            const error = new Error('Error de cors')
            callback(error)
        }
    }
}