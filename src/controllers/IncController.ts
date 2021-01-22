import { Request, Response } from 'express'
import * as express from 'express'
import * as cors from 'cors'
import path from 'path'
import db from '../database/conn'
const acc = express.Router()
import * as fs from 'fs'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface MulterRequest extends Request {
  fd: any
  file?: any
  filename?: string
}

export default {
  async createData(request: Request, response: Response) {
    const {
      requisitante,
      tipo,
      sistema,
      massivo,
      matricula,
      espelho
    } = request.body
    if (
      tipo === '' ||
      sistema === '' ||
      massivo === '' ||
      matricula === '' ||
      espelho === ''
    ) {
      return response.send({
        status_message: 'É necessario completar o checklist'
      })
    } else {
      const reqGroup = await db('users')
        .select('*')
        .where({ matricula: requisitante })
        .first()
      const ourDate = format(new Date(), 'yyyy-MM-dd', { locale: ptBR })

      const data = await db('chamados').insert({
        requisitante,
        group: reqGroup.group,
        responsavel: 'Não atribuido',
        tipo,
        sistema,
        massivo,
        matricula,
        espelho,
        status: 'Aberto',
        created: ourDate
      })
      const parse = ('00000000' + data[0]).slice(-8)

      const nchamado1 = 'ACC' + parse
      const up = await db('chamados')
        .update({ nchamado: nchamado1 })
        .where({ id: data[0] })
      if (up) {
        return response
          .status(200)
          .send({ status_message: `Chamado ${nchamado1} aberto` })
      } else {
        return response.json({ status_message: 'Ocorreu um erro inesperado' })
      }
    }
  },
  async create(request: Request, response: Response) {
    const { requisitante, tipo, sistema, massivo, espelho } = request.body
    let arquivo = (request as MulterRequest).file.filename
    const reqGroup = await db('users')
      .select('*')
      .where({ matricula: requisitante })
      .first()
    const today = format(new Date(), 'yyyy-MM-dd')

    const data = await db('chamados').insert({
      requisitante,
      group: reqGroup.group,
      responsavel: 'Não atribuido',
      tipo,
      sistema,
      massivo,
      matricula: `${arquivo}`,
      espelho,
      status: 'Aberto',
      created: today
    })
    const parse = ('00000000' + data[0]).slice(-8)

    const nchamado1 = 'ACC' + parse
    const up = await db('chamados')
      .update({ nchamado: nchamado1 })
      .where({ id: data[0] })
    if (up) {
      return response
        .status(200)
        .send({ status_message: `Chamado ${nchamado1} aberto` })
    } else {
      return response.json({ status_message: 'Ocorreu um erro inesperado' })
    }
  },

  async busca(request: Request, response: Response) {
    const { nchamado } = request.body
    const call = await db('chamados').select('*').first().where({ nchamado })

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.json({ status_message: 'Ocorreu um erro inesperado' })
    }
  },

  async data(request: Request, response: Response) {
    const call = await db('chamados')
      .select('*')
      .where({ responsavel: 'Não atribuido' })

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.json({ status_message: 'Ocorreu um erro inesperado' })
    }
  },
  async myData(request: Request, response: Response) {
    const user = request.headers.authorization
    const call = await db('chamados')
      .select('*')
      .where({ responsavel: user, status: 'Aberto' })
      .orWhere({ responsavel: user, status: 'Reaberto' })

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.json({ status_message: 'Ocorreu um erro inesperado' })
    }
  },
  async myDataClosed(request: Request, response: Response) {
    const user = request.headers.authorization
    const call = await db('chamados')
      .select('*')
      .where({ responsavel: user, status: 'Fechado' })

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.json({ status_message: 'Ocorreu um erro inesperado' })
    }
  },
  async relatorio(request: Request, response: Response) {
    const user = request.headers.authorization
    const call = await db('chamados').select('*')

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.status(404).json({ status_message: 'Not Found' })
    }
  },

  async seven(request: Request, response: Response) {
    const today = new Date()
    const ourDate = new Date()
    const pastDate = ourDate.getDate() - 7
    ourDate.setDate(pastDate)

    const call = await db('chamados')
      .select('sistema')
      .count({ quantidade: 'sistema' })
      .groupBy('sistema')
      .orderBy('sistema', 'ASC')
      .where('created', '>', ourDate)
      .andWhere('created', '<', today)
      .limit(4)

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.json({ status_message: 'Ocorreu um erro inesperado' })
    }
  },
  async fifteen(request: Request, response: Response) {
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
      .where('created', '>', ourDate)
      .andWhere('created', '<', today)
      .limit(4)

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.json({ status_message: 'Ocorreu um erro inesperado' })
    }
  },
  async thirty(request: Request, response: Response) {
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
      .where('created', '>', ourDate)
      .andWhere('created', '<', ourDate1)
      .limit(4)

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.json({ status_message: 'Ocorreu um erro inesperado' })
    }
  },
  async reabre(request: Request, response: Response) {
    const { desc } = request.body.data
    const { nchamado, requisitante } = request.body
    const auth = request.headers.authorization

    if (auth === requisitante) {
      const valida = await db('chamados')
        .select('*')
        .where({ nchamado })
        .first()
      if (valida.status !== 'Fechado') {
        return response.send({
          status_message: 'Não foi possivel reabrir o chamado: status Aberto'
        })
      } else {
        const sql = await db('chamados')
          .update({ desc, status: 'Reaberto' })
          .where({ nchamado })
        if (sql) {
          return response.status(200).send({
            status_message: `Chamado ${nchamado} reaberto`
          })
        } else {
          return response.send({
            status_message: 'Apenas o responsável pode reabrir o chamado'
          })
        }
      }
    } else {
      return response.send({
        status_message: 'Você não tem permissao para reabrir esse chamado'
      })
    }
  },
  async cancela(request: Request, response: Response) {
    const { desc } = request.body.data
    const { nchamado, requisitante } = request.body
    const auth = request.headers.authorization

    if (auth === requisitante) {
      const sql = await db('chamados')
        .update({ desc, status: 'Fechado' })
        .where({ nchamado })
      if (sql) {
        return response.status(200).send({
          status_message: `Chamado ${nchamado} cancelado`
        })
      } else {
        return response.send({
          status_message: 'Não foi possivel cacnelar o chamado'
        })
      }
    } else {
      return response.send({
        status_message: 'Você não tem permissao para cancelar esse chamado'
      })
    }
  }
}
