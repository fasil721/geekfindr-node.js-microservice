import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors'

import { signupRouter } from './routes/signup'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { errorHandler } from './middlewares/errorHandler'
import { NotFoundError } from './errors/notFoundError'
import { connectDB } from './config/db'

const app = express()
app.set('trust proxy', true)
app.use(json())

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

app.all('*', () => {
  throw new NotFoundError()
})
app.use(errorHandler)

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined')
  }
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URI must be defined')
  }
  connectDB()
  app.listen(3000, () => {
    console.log('Auth service listening on port 3000...')
  })
}
start()
