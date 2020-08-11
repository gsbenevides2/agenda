import express from 'express'
import cors from 'cors'
import routes from './routes'
import { errors } from 'celebrate'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

const corsOptions:cors.CorsOptions = {
  origin: process.env.CORS
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(routes)
app.use(errors())

const port = process.env.PORT || 3333
app.listen(port, () => {
  console.log('Servidor rodando na porta:', port)
})
