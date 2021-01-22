import * as nodemailer from 'nodemailer'

const remetente = nodemailer.createTransport({
  host: process.env.NODEMAILER_USER,
  service: '',
  port: process.env.NODEMAILER_PORT,
  secure: false
})

export default remetente
