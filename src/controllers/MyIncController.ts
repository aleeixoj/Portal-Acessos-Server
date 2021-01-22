import { Request, Response } from 'express'
import * as express from 'express'
import * as cors from 'cors'
import path from 'path'
import db from '../database/conn'
const acc = express.Router()

export default {
  async seven(request: Request, response: Response) {
    const responsavel = request.headers.authorization
    const today = new Date()
    const ourDate = new Date()
    const pastDate = ourDate.getDate() - 7
    ourDate.setDate(pastDate)

    const call = await db('chamados')
      .select('sistema')
      .count({ quantidade: 'sistema' })
      .groupBy('sistema')
      .orderBy('sistema', 'ASC')
      .where({ responsavel })
      .andWhere('created', '>', ourDate)
      // .andWhere('created', '<', today)
      .limit(4)

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.json({ status_message: 'Ocorreu um erro inesperado' })
    }
  },
  async fifteen(request: Request, response: Response) {
    const responsavel = request.headers.authorization
    const ourDate = new Date()
    const pastDate = ourDate.getDate() - 15
    ourDate.setDate(pastDate)

    const today = new Date()
    const pastDate1 = today.getDate() - 7
    today.setDate(pastDate1)

    const call = await db('chamados')
      .select('sistema')
      .count({ quantidade: 'sistema' })
      .groupBy('sistema')
      .orderBy('sistema', 'ASC')
      .where('responsavel', '=', responsavel)
      .andWhere('created', '>', ourDate)
      .limit(4)

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.json({ status_message: 'Ocorreu um erro inesperado' })
    }
  },
  async thirty(request: Request, response: Response) {
    const responsavel = request.headers.authorization
    const ourDate = new Date()
    const pastDate = ourDate.getDate() - 30
    ourDate.setDate(pastDate)

    const ourDate1 = new Date()
    const pastDate1 = ourDate1.getDate() - 15
    ourDate1.setDate(pastDate1)

    const call = await db('chamados')
      .select('sistema')
      .count({ quantidade: 'sistema' })
      .groupBy('sistema')
      .orderBy('sistema', 'ASC')
      .where('responsavel', '=', responsavel)
      .andWhere('created', '>', ourDate)
      .limit(4)

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.json({ status_message: 'Ocorreu um erro inesperado' })
    }
  }
}
