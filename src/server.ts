import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as path from 'path'

const app = express()
const port = process.env.PORT || 3333

app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(cors())

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

import acc from './routes'

app.use(acc)
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(port, () => {
  console.log('O servidor foi inicializado na porta: ' + port)
})
