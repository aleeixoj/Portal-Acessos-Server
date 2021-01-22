import { Request, Response } from 'express'
import * as express from 'express'
import * as cors from 'cors'
import * as jwt from 'jsonwebtoken'
import { ActiveDirectory } from 'node-ad-tools'
import ad from '../database/ad_db'
import conexao_ad from '../conexao_ad'
import db from '../database/conn'
import * as log4js from 'log4js'
import * as path from 'path'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const acc = express.Router()
acc.use(cors())
const today = format(new Date(), 'yyyy-MM-dd', { locale: ptBR })
const hour = format(new Date(), 'HH-mm-ss', { locale: ptBR })

export default {
  async index(request: Request, response: Response) {
    const { mat, password, ip_user } = request.body

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
    if (mat === '' || mat === undefined) {
      return response.json({ status_message: 'A matricula é necessaria' })
    }

    if (password === '' || password === undefined) {
      return response.json({
        status_message: 'A senha é obrigatoria'
      })
    }

    const server_ad = '@redecorp.br'
    const matricula_login = mat + server_ad
    const result_conect_ad = await conexao_ad.ADPromisses
    const resultado = await result_conect_ad.loginUser(
      matricula_login,
      password
    )
    if (resultado.success) {
      const dados_user = await ActiveDirectory.createUserObj(resultado.entry)
      for (const key in dados_user.groups) {
        if (dados_user.groups[key] == 'AcessosUSR') {
          const sql = await db('users').where({ matricula: mat }).first()
          if (sql) {
            const token = jwt.sign({ mat }, process.env.SECRET_KEY, {
              expiresIn: 1440
            })
            const logger = log4js.getLogger('default')
            logger.debug('Conectando ao sistema')
            logger.info(`Usuario ${mat} conectado com sucesso`)
            return response.status(200).send({ mat, password, token, ip_user })
          } else {
            try {
              const consulta = await ad('uteis_dim_colaboradores_insourcing')
                .select('*')
                .where({ MATRICULA_COMPLETA: mat })
                .first()
              if (consulta) {
                const createUserInTableUsers = await db('users').insert({
                  matricula: consulta.MATRICULA_COMPLETA,
                  name: consulta.COLABORADOR,
                  value: consulta.COLABORADOR,
                  label: consulta.COLABORADOR,
                  email: consulta.SNOEMAIL,
                  cargo: consulta.CARGO,
                  group: consulta.SUBGRUPO,
                  created: new Date(),
                  lastModified: new Date()
                })
                if (createUserInTableUsers) {
                  const super_user = await db('super_user').insert({
                    super_id: 1,
                    user_id: createUserInTableUsers[0]
                  })
                  const token = jwt.sign({ mat }, process.env.SECRET_KEY, {
                    expiresIn: 1440
                  })
                  const logger = log4js.getLogger('default')
                  logger.debug('Conectando ao sistema')
                  logger.info(`Usuario ${mat} conectado com sucesso`)
                  return response.status(200).send({ mat, password, token })
                } else {
                  const logger = log4js.getLogger('error')
                  logger.error(
                    `${mat} - Erro ao criar o usuário no banco de dados`
                  )
                  return response
                    .status(400)
                    .send({ status_message: 'Erro ao criar o usuario' })
                }
              }
            } catch (error) {
              const logger = log4js.getLogger('error')
              logger.error(`${mat} - Erro ao criar o usuário no banco de dados`)
              return response.send({ status_message: error })
            }
          }
        } else if (dados_user.groups[key] == 'AcessosADM') {
          const sql = await db('users').where({ matricula: mat }).first()
          if (sql) {
            const token = jwt.sign({ mat }, process.env.SECRET_KEY, {
              expiresIn: 1440
            })
            const logger = log4js.getLogger('portal')
            logger.debug('Conectando ao sistema')
            logger.info(`Usuario ${mat} conectado com sucesso`)
            return response.status(200).send({ mat, password, token, ip_user })
          } else {
            try {
              const consulta = await ad('uteis_dim_colaboradores_insourcing')
                .select('*')
                .where({ MATRICULA_COMPLETA: mat })
                .first()
              if (consulta) {
                const createUserInTableUsers = await db('users').insert({
                  matricula: consulta.MATRICULA_COMPLETA,
                  name: consulta.COLABORADOR,
                  value: consulta.COLABORADOR,
                  label: consulta.COLABORADOR,
                  email: consulta.SNOEMAIL,
                  cargo: consulta.CARGO,
                  group: consulta.SUBGRUPO,
                  created: new Date(),
                  lastModified: new Date()
                })
                if (createUserInTableUsers) {
                  const super_user = await db('super_user').insert({
                    super_id: 4,
                    user_id: createUserInTableUsers[0]
                  })
                  const token = jwt.sign({ mat }, process.env.SECRET_KEY, {
                    expiresIn: 1440
                  })
                  const logger = log4js.getLogger('default')
                  logger.debug('Conectando ao sistema')
                  logger.info(`Usuario ${mat} conectado com sucesso`)
                  return response
                    .status(200)
                    .send({ mat, password, token, ip_user })
                } else {
                  const logger = log4js.getLogger('error')
                  logger.error(
                    `${mat} - Erro ao criar o usuário no banco de dados`
                  )
                  return response.send({
                    status_message: 'Erro ao criar o usuario'
                  })
                }
              }
            } catch (error) {
              const logger = log4js.getLogger('error')
              logger.error(`${mat} - Erro ao criar o usuário no banco de dados`)
              return response.send({ status_message: error })
            }
          }
        } else {
          //(
          //   !dados_user.groups[key]
          //   //  == undefined &&
          //   // dados_user.groups[key] == ['']
          // ) {
          const logger = log4js.getLogger('error')
          logger.error(`${mat} - Não possui acesso ao sistema`)
          return response.send({
            status_message: 'Você não possui acesso a ferramenta'
          })
        }
      }
    } else {
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
      return response.send({
        status_message: 'Erro ao logar, consulte seu CSL para mais informações'
      })
    }
  },
  async logout(request: Request, response: Response) {
    const { mat } = request.body

    const logger = log4js.getLogger('default')
    logger.info(`Usuario ${mat} deslogado`)
    return response.send(`Matricula ${mat} deslogada`)
  },
  async show(request: Request, response: Response) {
    const user = await db('users')
      .where({ matricula: request.headers.authorization })
      .select('*')
      .first()

    const { id, matricula: mat, name, email, arquivo } = user

    const { super_id } = await db('super_user').where({ user_id: id }).first()

    const profile = {
      id,
      super_id,
      mat,
      name,
      email,
      arquivo
    }

    if (user) {
      return response.send(profile)
    }
  }
}
