import { Request, Response } from 'express'
import * as express from 'express'
import * as cors from 'cors'
import path from 'path'
import db from '../database/conn'
import * as nodemailer from 'nodemailer'
import remetente from '../nodemailer'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const acc = express.Router()

export default {
  async index(request: Request, response: Response) {
    const data = request.body
    const respo = request.headers.authorization
    const today = format(new Date(), 'yyyy-MM-dd', { locale: ptBR })

    const trx = await db.transaction()
    try {
      const insertInc = await trx('chamados')
        .update({
          responsavel: respo,
          lastModified: today,
          desc: `Chamado atribuido para ${respo}`
        })
        .where('id', 'IN', data)

      const user = await trx('users').select('id').where({ matricula: respo })
      const user_id = user.map((id: any) => id.id)
      const id_user = user_id.toString()

      await Promise.all(
        data.map(async element => {
          const buscaSql = await trx('chamados')
            .select('*')
            .where({ id: element })
            .first()
          const contents = await trx('chamado_user').insert({
            user_id: id_user,
            nchamado: buscaSql.nchamado
          })
          const emailASerEnviado = {
            from: 'portal.acessos@telefonica.com',
            cc: 'aleixo.junior@telefonica.com; felipe.sa@telefonica.com',
            to: 'aleixo.junior@telefonica.com',
            subject: 'testando',
            text: `O Chamado ${buscaSql.nchamado} foi atribuido para o assistente ${respo}`
          }
          remetente.sendMail(emailASerEnviado, function (error) {
            if (error) {
              console.log(error)
            } else {
              console.log('success')
            }
          })
        })
      )

      await trx.commit()
      return response.status(200).json({ status_message: 'Success' })
    } catch (err) {
      await trx.rollback()
      return response.json({
        error: 'An unexpected error occurred while assigning a ticket'
      })
    }
  },
  async rotear(request: Request, response: Response) {
    const data = request.body.data
    const array = request.body.array
    const respo = request.headers.authorization
    const today = new Date()

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
          array.map(async element => {
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
              const emailASerEnviado = {
                from: 'portal.acessos@telefonica.com',
                cc: 'aleixo.junior@telefonica.com; felipe.sa@telefonica.com',
                to: 'aleixo.junior@telefonica.com',
                subject: 'testando',
                text: `O Chamado ACC${element} foi atribuido para o assistente ${data.rotear}`
              }
              remetente.sendMail(emailASerEnviado, function (error) {
                if (error) {
                  console.log(error)
                } else {
                  console.log('success')
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
              const emailASerEnviado = {
                from: 'portal.acessos@telefonica.com',
                cc: 'Acessos.Atendimento.ao.Cliente.br@telefonica.com',
                to: 'aleixo.junior@telefonica.com',
                subject: 'testando',
                text: `O Chamado ACC${element} foi atribuido para o assistente ${data.rotear}`
              }
              remetente.sendMail(emailASerEnviado, function (error) {
                if (error) {
                  console.log(error)
                } else {
                  console.log('success')
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
  },
  async fechar(request: Request, response: Response) {
    const data = request.body

    const trx = await db.transaction()
    await Promise.all(
      data.forEach(async element => {
        const respo = request.headers.authorization
        const mat = respo
        // const sql = await trx('users').select('*').first().where({ matricula })
        const query = await trx('chamados')
          .select('*')
          .where({ id: element })
          .first()

        if (query) {
          const up = await trx('chamados')
            .update({
              status: 'Fechado',
              desc: 'O Chamado foi tratado com Sucesso',
              lastModified: new Date()
            })
            .where({ id: element })
          await trx.commit()
          return response.status(200).send({ status_message: 'Sucesso' })
        } else {
          await trx.rollback()
          return response.status(400).send({
            status_message: 'Você não possui permissão para fechar o chamado'
          })
        }
      })
    )
  },
  async systems(request: Request, response: Response) {
    const sql = await db('system').select('*')
    if (sql) {
      return response.status(200).send(JSON.parse(JSON.stringify(sql)))
    } else {
      return response.status(400).json({ status_message: 'Err' })
    }
  },
  async types(request: Request, response: Response) {
    const sql = await db('type').select('*')
    if (sql) {
      return response.status(200).send(JSON.parse(JSON.stringify(sql)))
    } else {
      return response.status(400).json({ status_message: 'Err' })
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
