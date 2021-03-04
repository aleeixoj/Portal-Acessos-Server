const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_USER,
  service: '',
  port: 25,
  secure: false
})

export default transporter
