require('dotenv').config()
import { Request, Response } from 'express'
import db from '../database/conn'
import path from 'path'
import log4js from 'log4js'
import ad from '../database/ad_db'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
const today = format(new Date(), 'yyyy-MM-dd', { locale: ptBR })
const hour = format(new Date(), 'HH-mm-ss', { locale: ptBR })
import transporter from '../nodemailer'

interface MulterRequest extends Request {
  fd: any
  file: any
  filename: string
}

export default {
  async createData(request: Request, response: Response) {
    //declara as constantes recebidas do front
    const {
      requisitante,
      tipo,
      sistema,
      massivo,
      matricula,
      espelho,
      typeOfSystem
    } = request.body
    let link = request.body.linkSystem
    //declara os logs

    const caminh = `${path.resolve(
      __dirname,
      '..',
      '..',
      'logs',
      `${requisitante} - ${today} - ${hour}.log`
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

    //validação se o s campos preenchidos estão preenchidos
    if (
      tipo === '' ||
      sistema === '' ||
      massivo === '' ||
      matricula === '' ||
      espelho === '' ||
      typeOfSystem === ''
    ) {
      // Criando logs
      const logger = log4js.getLogger('error')
      logger.error(`${requisitante} - É necessario completar o checklist`)
      //enviando resposta ao front
      return response.send({
        status_message: 'É necessario completar o checklist'
      })
    } else {
      const validaEspelho = await ad('uteis_dim_colaboradores_insourcing')
        .select('*')
        .where({ MATRICULA_COMPLETA: espelho })
        .first()
      if (validaEspelho) {
        const reqGroup = await db('users')
          .select('*')
          .where({ matricula: requisitante })
          .first()
        const ourDate = format(new Date(), 'yyyy-MM-dd')
        //criando chamado
        const data = await db('chamados').insert({
          requisitante,
          group: reqGroup.group,
          color: reqGroup.color,
          responsavel: 'Não atribuido',
          tipo,
          sistema,
          typeOfSystem,
          linkSystem: link === undefined ? '#N/D' : link,
          massivo,
          matricula,
          espelho,
          status: 'Aberto',
          created: ourDate
        })
        //gerando numero do chamado
        const parse = ('00000000' + data[0]).slice(-8)

        const nchamado = 'ACC' + parse
        const up = await db('chamados')
          .update({ nchamado: nchamado })
          .where({ id: data[0] })
        if (up) {
          //criando logs
          const logger = log4js.getLogger('debug')
          logger.info(`${requisitante} - Chamado ${nchamado} aberto`)
          const user = await db('users')
            .select('*')
            .where({ matricula: requisitante })
            .first()

          const emailASerEnviado = {
            from: 'Portal Acessos <portal.eq.acessos.br@telefonica.com>',
            to: `${user.email}`,
            subject: `${nchamado}`,

            html: `<center>
          <div> 
            <h1>O Chamado ${nchamado} foi aberto</h1>
          </div>
          </center>
          `
          }
          transporter.sendMail(emailASerEnviado, function (error: any) {
            if (error) {
              const logger = log4js.getLogger('error')
              logger.error(error)
            } else {
              const logger = log4js.getLogger('debug')
              logger.info(`O Chamado ${nchamado} foi aberto`)
            }
          })
          //enviando resposta ao front
          return response
            .status(200)
            .send({ status_message: `Chamado ${nchamado} aberto` })
        } else {
          //enviando resposta ao front
          const logger = log4js.getLogger('error')
          logger.error(`${requisitante} - Ocorreu um erro inesperado`)
          return response.json({ status_message: 'Ocorreu um erro inesperado' })
        }
      } else {
        const logger = log4js.getLogger('error')
        logger.error(`${requisitante} - Matricula espelho incorreta`)
        return response.send({ status_message: `Matricula espelho incorreta` })
      }
    }
  },
  async create(request: Request, response: Response) {
    const {
      requisitante,
      tipo,
      sistema,
      massivo,
      espelho,
      linkSystem,
      typeOfSystem
    } = request.body

    const caminh = `${path.resolve(
      __dirname,
      '..',
      '..',
      'logs',
      `${requisitante} - ${today} - ${hour}.log`
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
    let arquivo = (request as MulterRequest).file.filename

    if (
      tipo === '' ||
      sistema === '' ||
      massivo === '' ||
      espelho === '' ||
      typeOfSystem === ''
    ) {
      // Criando logs
      const logger = log4js.getLogger('error')
      logger.error(`${requisitante} - É necessario completar o checklist`)
      //enviando resposta ao front
      return response.send({
        status_message: 'É necessario completar o checklist'
      })
    } else {
      const validaEspelho = await ad('uteis_dim_colaboradores_insourcing')
        .select('*')
        .where({ MATRICULA_COMPLETA: espelho })
        .first()
      if (validaEspelho) {
        const reqGroup = await db('users')
          .select('*')
          .where({ matricula: requisitante })
          .first()

        const data = await db('chamados').insert({
          requisitante,
          group: reqGroup.group,
          color: reqGroup.color,
          responsavel: 'Não atribuido',
          tipo,
          sistema,
          massivo,
          linkSystem,
          typeOfSystem,
          matricula: `${arquivo}`,
          espelho,
          status: 'Aberto',
          created: today
        })
        const parse = ('00000000' + data[0]).slice(-8)

        const nchamado = 'ACC' + parse
        const up = await db('chamados')
          .update({ nchamado: nchamado })
          .where({ id: data[0] })
        if (up) {
          const logger = log4js.getLogger('default')
          logger.info(`${requisitante} - Chamado ${nchamado} aberto`)
          const user = await db('users')
            .select('*')
            .where({ matricula: requisitante })
            .first()

          const emailASerEnviado = {
            from: 'Portal Acessos <portal.eq.acessos.br@telefonica.com>',
            to: `${user.email}`,
            subject: `${nchamado}`,

            html: `<center><img style="width: 116px;" src="http://localhost:3000/static/media/Banner.289ad67d.svg" alt=""/></center>
          <div> 
            <h1>O Chamado ${nchamado} foi aberto</h1>
          </div>
          `
          }
          transporter.sendMail(emailASerEnviado, function (error: any) {
            if (error) {
              const logger = log4js.getLogger('error')
              logger.error(error)
            } else {
              const logger = log4js.getLogger('debug')
              logger.info(`O Chamado ${nchamado} foi aberto`)
            }
          })
          return response
            .status(200)
            .send({ status_message: `Chamado ${nchamado} aberto` })
        } else {
          const logger = log4js.getLogger('error')
          logger.error(`${requisitante} - Ocorreu um erro inesperado`)
          return response.json({ status_message: 'Ocorreu um erro inesperado' })
        }
      } else {
        const logger = log4js.getLogger('error')
        logger.error(`${requisitante} - Matricula espelho incorreta`)
        return response.send({ status_message: `Matricula espelho incorreta` })
      }
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
  async relatorio(request: Request, response: Response) {
    const user = request.headers.authorization
    const call = await db('chamados')
      .select('*')
      .orderByRaw('FIELD(color, "gold", "purple") ASC, created ASC')

    if (call) {
      return response.status(200).send(JSON.parse(JSON.stringify(call)))
    } else {
      return response.status(404).json({ status_message: 'Not Found' })
    }
  },
  async index(request: Request, response: Response) {
    const data = request.body
    const respo = request.headers.authorization

    const caminh = `${path.resolve(
      __dirname,
      '..',
      '..',
      'logs',
      `${respo} - ${today} - ${hour}.log`
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
      const userName = await trx('users')
        .where({ matricula: respo })
        .select('name')
        .first()
      const insertInc = await trx('chamados')
        .update({
          responsavel: respo,
          lastModified: today,
          desc: `Chamado atribuído para ${userName.name}`
        })
        .where('id', 'IN', data)

      const user = await trx('users').select('id').where({ matricula: respo })
      const user_id = user.map((id: any) => id.id)
      const id_user = user_id.toString()

      await Promise.all(
        data.map(async (element: any) => {
          const buscaSql = await trx('chamados')
            .select('*')
            .where({ id: element })
            .first()
          const contents = await trx('chamado_user').insert({
            user_id: id_user,
            nchamado: buscaSql.nchamado
          })
          const emailASerEnviado = {
            from: 'Portal Acessos <portal.eq.acessos.br@telefonica.com>',
            to: `${buscaSql.requisitante}`,
            subject: `${buscaSql.nchamado}`,
            html: `<h1>O Chamado ${buscaSql.nchamado} foi atribuído para o assistente ${userName.name}</h1>`
          }
          transporter.sendMail(emailASerEnviado, function (error: any) {
            if (error) {
              const logger = log4js.getLogger('error')
              logger.error(error)
            } else {
              const logger = log4js.getLogger('default')
              logger.info(
                `O Chamado ${buscaSql.nchamado} foi atribuído para o assistente ${userName.name}`
              )
            }
          })
          const logger = log4js.getLogger('debug')
          logger.info(
            `O Chamado ${buscaSql.nchamado} foi atribuído para o assistente ${userName.name}`
          )
        })
      )

      await trx.commit()
      return response.status(200).json({ status_message: 'Success' })
    } catch (err) {
      await trx.rollback()
      const logger = log4js.getLogger('error')
      logger.info(`An unexpected error occurred while assigning a ticket`)
      return response.json({
        error: 'An unexpected error occurred while assigning a ticket'
      })
    }
  },
  async rotear(request: Request, response: Response) {
    const data = request.body.data
    const array = request.body.array
    const respo = request.headers.authorization
    const caminh = `${path.resolve(
      __dirname,
      '..',
      '..',
      'logs',
      `${respo} - ${today} - ${hour}.log`
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
      const call = await trx('users')
        .select('*')
        .where({ matricula: respo })
        .first()
      const superId = await trx('super_user')
        .select('*')
        .where({ user_id: call.id })
        .first()
      if (superId.super_id > 2) {
        const user = await trx('users')
          .select('*')
          .where({ label: data.rotear })
          .first()
        const user_id = user.id.toString()

        await Promise.all(
          array.map(async (element: any) => {
            const sql = await trx('chamado_user')
              .where({ nchamado: element })
              .first()
            if (sql) {
              const contents = await trx('chamado_user')
                .update({
                  user_id
                })
                .where({ nchamado: element })
              const up = await trx('chamados')
                .update({
                  responsavel: user.matricula,
                  desc: `Chamado atribuido para ${data.rotear}`
                })
                .where({ id: element })
              const buscaSql = await trx('chamados')
                .select('*')
                .where({ id: element })
                .first()
              const emailASerEnviado = {
                from: 'Portal Acessos <portal.eq.acessos.br@telefonica.com>',
                to: `${buscaSql.requisitante}`,
                subject: `${buscaSql.nchamado}`,
                html: `<h1>O Chamado ${buscaSql.nchamado} foi atribuido para o assistente ${data.rotear}</h1>`
              }
              transporter.sendMail(emailASerEnviado, function (error: any) {
                if (error) {
                  const logger = log4js.getLogger('error')
                  logger.error(error)
                } else {
                  const logger = log4js.getLogger('default')
                  logger.info(
                    `O Chamado ${buscaSql.nchamado} foi atribuído para o assistente ${data.rotear}`
                  )
                }
              })
            } else {
              const contents = await trx('chamado_user').insert({
                user_id,
                nchamado: element
              })
              const up = await trx('chamados')
                .update({
                  responsavel: user.matricula
                })
                .where({ id: element })
              const buscaSql = await trx('chamados')
                .select('*')
                .where({ id: element })
                .first()
              const emailASerEnviado = {
                from: 'Portal Acessos <portal.eq.acessos.br@telefonica.com>',
                to: `${buscaSql.requisitante}`,
                subject: `${buscaSql.nchamado}`,
                html: `<h1>O Chamado ${buscaSql.nchamado} foi atribuido para o assistente ${data.rotear}</h1>`
              }
              transporter.sendMail(emailASerEnviado, function (error: any) {
                if (error) {
                  const logger = log4js.getLogger('error')
                  logger.error(error)
                } else {
                  const logger = log4js.getLogger('default')
                  logger.info(
                    `O Chamado ${buscaSql.nchamado} foi atribuído para o assistente ${data.rotear}`
                  )
                }
              })
            }
          })
        )
      } else {
        return response.send({
          status_message: 'Voce não possui permissão para rotear tickets'
        })
      }
      await trx.commit()
      return response.status(200).json({
        status_message: `Os chamados selecionados foram roteados`
      })
    } catch (err) {
      await trx.rollback()
      return response.status(400).json({
        error: 'An unexpected error occurred while assigning a ticket'
      })
    }
  },
  async fechar(request: Request, response: Response) {
    const { toStringfy } = request.body
    const { descr } = request.body.data

    const user = request.headers.authorization
    const trx = await db.transaction()
    const caminh = `${path.resolve(
      __dirname,
      '..',
      '..',
      'logs',
      `${user} - ${today} - ${hour}.log`
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
      const buscaSql = await trx('chamados')
        .select('*')
        .first()
        .where({ id: toStringfy })
      const sql = await trx('chamados')
        .update({
          status: 'Fechado',
          desc: descr
        })
        .where({ id: toStringfy })
      const logger = log4js.getLogger('default')
      logger.info(
        `O Chamado ${buscaSql.nchamado} foi atribuído tratado com sucesso`
      )

      const emailASerEnviado = {
        from: 'Portal Acessos <portal.eq.acessos.br@telefonica.com>',
        to: `${buscaSql.requisitante}`,
        subject: `${buscaSql.nchamado}`,
        html: `<h1>O Chamado ${buscaSql.nchamado} foi atribuído tratado com sucesso</h1>`
      }

      transporter.sendMail(emailASerEnviado, function (error: any) {
        if (error) {
          const logger = log4js.getLogger('error')
          logger.error(error)
        } else {
          const logger = log4js.getLogger('default')
          logger.info(
            `O Chamado ${buscaSql.nchamado} foi atribuído tratado com sucesso`
          )
        }
      })

      await trx.commit()
      return response.send({ status_message: 'Success' })
    } catch (err) {
      await trx.rollback()
      const logger = log4js.getLogger('error')
      logger.info(`${err}`)
      return response.send({ status_message: 'Ocorreu um erro' })
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

        const buscaSql = await db('chamados')
          .select('*')
          .where({ nchamado })
          .first()

        if (sql) {
          const emailASerEnviado = {
            from: 'Portal Acessos <portal.eq.acessos.br@telefonica.com>',
            to: `${buscaSql.requisitante}`,
            subject: `${buscaSql.nchamado}`,
            html: `<h1>O Chamado ${buscaSql.nchamado} foi reaberto</h1>`
          }
          transporter.sendMail(emailASerEnviado, function (error: any) {
            if (error) {
              const logger = log4js.getLogger('error')
              logger.error(error)
            } else {
              const logger = log4js.getLogger('default')
              logger.info(`O Chamado ${nchamado} foi reaberto`)
            }
          })
          const logger = log4js.getLogger('debug')
          logger.info(`O Chamado ${nchamado} foi reaberto`)

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
      const buscaSql = await db('chamados')
        .select('*')
        .where({ nchamado })
        .first()
      if (sql) {
        const emailASerEnviado = {
          from: 'Portal Acessos <portal.eq.acessos.br@telefonica.com>',
          to: `${buscaSql.requisitante}`,
          subject: `${buscaSql.nchamado}`,
          html: `<h1>O Chamado ${buscaSql.nchamado} foi reaberto</h1>`
        }
        transporter.sendMail(emailASerEnviado, function (error: any) {
          if (error) {
            const logger = log4js.getLogger('error')
            logger.error(error)
          } else {
            const logger = log4js.getLogger('default')
            logger.info(`O Chamado ${nchamado} foi reaberto`)
          }
        })
        const logger = log4js.getLogger('debug')
        logger.info(`O Chamado ${nchamado} foi reaberto`)
        return response.status(200).send({
          status_message: `Chamado ${nchamado} cancelado`
        })
      } else {
        return response.send({
          status_message: 'Não foi possivel cancelar o chamado'
        })
      }
    } else {
      return response.send({
        status_message: 'Você não tem permissao para cancelar esse chamado'
      })
    }
  },
  async editRow(request: Request, response: Response) {
    const data = request.body
    const today = new Date()
    const trx = await db.transaction()

    const id = data.id
    try {
      if (data.status === true) {
        const status = 'Fechado'
        const editRows = await trx('chamados')
          .update({
            status,
            desc: data.desc,
            lastModified: today
          })
          .where({ id })
      } else {
        const status = 'Aberto'
        const editRows = await trx('chamados')
          .update({
            status,
            desc: data.desc,
            lastModified: today
          })
          .where({ id })
      }

      await trx.commit()
      return response.status(201).json({ status_message: 'Success' })
    } catch {
      await trx.rollback()
      return response.status(400).json({
        error: 'An unexpected error occurred while assigning a ticket'
      })
    }
  }
}
