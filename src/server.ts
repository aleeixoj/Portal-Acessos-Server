import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3333

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(cors())
// app.use(
//   session({
//     secret: 'keyboard cat',
//     saveUnitialized: false,
//     resave: false
//   })
// )

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

import acc from './routes'
import { config } from 'process'

app.use(acc)
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(port, () => {
  console.log('O servidor foi inicializado na porta: ' + port)
})
