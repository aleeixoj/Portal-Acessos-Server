import { Request, Response } from 'express'
import path from 'path'
import log4js from 'log4js'
import db from '../database/conn'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const today = format(new Date(), 'yyyy-MM-dd', { locale: ptBR })
const hour = format(new Date(), 'HH-mm-ss', { locale: ptBR })

export default {
  async addSistema(request: Request, response: Response) {
    const { system } = request.body
    const mat = request.headers.authorization
    const trx = await db.transaction()

    const caminh = `${path.resolve(
      __dirname,
      '..',
      '..',
      'logs',
      `${mat} - ${today} - ${hour}.log`
    )}`
    log4js.configure({
      appenders: {
        portal: {
          type: 'file',
          filename: caminh
        }
      },
      categories: {
        default: { appenders: ['portal'], level: 'debug' },
        error: { appenders: ['portal'], level: 'error' }
      }
    })

    try {
      const sql = await trx('system').insert({
        label: system,
        value: system
      })
      await trx.commit()
      const logger = log4js.getLogger('default')
      logger.debug('Adicionando novo sistema')
      logger.info(`Novo sistema adicionado com sucesso`)
      return response
        .status(200)
        .send({ status_message: 'Novo sistema adicionado' })
    } catch (err) {
      await trx.rollback()
      const logger = log4js.getLogger('error')
      logger.error(`Ocorreu um erro ao adicionar um novo sistema ` + err)
      return response.status(400).send({ status_message: err })
    }
  },
  async addType(request: Request, response: Response) {
    const { type } = request.body
    const mat = request.headers.authorization
    const caminh = `${path.resolve(
      __dirname,
      '..',
      '..',
      'logs',
      `${mat} - ${today} - ${hour}.log`
    )}`
    log4js.configure({
      appenders: {
        portal: {
          type: 'file',
          filename: caminh
        }
      },
      categories: {
        default: { appenders: ['portal'], level: 'debug' },
        error: { appenders: ['portal'], level: 'error' }
      }
    })
    const trx = await db.transaction()

    try {
      const sql = await trx('type').insert({
        label: type,
        value: type
      })
      await trx.commit()
      const logger = log4js.getLogger('default')
      logger.debug('Adicionando novo tipo de solicitação')
      logger.info(`Novo tipo de solicitação adicionado com sucesso`)
      return response
        .status(200)
        .send({ status_message: 'Novo tipo de solicitação adicionado' })
    } catch (err) {
      const logger = log4js.getLogger('error')
      logger.error(`Ocorreu um erro ao adicionar um novo sistema ` + err)
      await trx.rollback()
      return response.send({ status_message: err })
    }
  },
  //Lista os sistemas tratados por acessos.
  async systems(request: Request, response: Response) {
    const sql = await db('system').select('*')
    if (sql) {
      return response.status(200).send(JSON.parse(JSON.stringify(sql)))
    } else {
      return response.status(400).json({ status_message: 'Err' })
    }
  },
  //lista os tipos de solicitações tratadas por acessos.
  async types(request: Request, response: Response) {
    const sql = await db('type').select('*')
    if (sql) {
      return response.status(200).send(JSON.parse(JSON.stringify(sql)))
    } else {
      return response.status(400).json({ status_message: 'Err' })
    }
  },
  //Lista todos os chamados abertos.
  async data(request: Request, response: Response) {
    const call = await db('chamados')
      // .select(
      //   db.raw(
      //     '`id`, `color`, `nchamado`, `requisitante`, `group`, `sistema`, `tipo`, `massivo`, `matricula`, `espelho`, `status`, DATE_FORMAT(created, "%d-%m-%Y"), `lastModified`, `responsavel`, `desc` '
      //   )
      // )
      .where({ responsavel: 'Não atribuido' })
      .orderByRaw('FIELD(color, "gold", "purple") ASC, created ASC')
    // .orderBy('created', 'asc')

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.json({ status_message: 'Ocorreu um erro inesperado' })
    }
  },
  //grafico dos ultimos 7 dias
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
  //grafico dos ultimos 15 dias
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
  //grafico dos ultimos 30 dias
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
  }
  // async downloadFile(request: Request, response: Response) {
  //   const { nchamado } = request.body

  //   const buscaSql = await db('chamados')
  //     .where({ nchamado })
  //     .select('matricula')

  //   const arquivo = `http://localhost:3333/uploads`

  //   if(buscaSql){
  //     return response.status(200).json(JSON.parse(JSON.stringify(buscaSql)))
  //   }
  //   else{
  //     return response.status(400).json({status_message: 'Erro ao buscar o arquivo'})
  //   }
  // }
}
