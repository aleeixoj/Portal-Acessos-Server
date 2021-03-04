import { Request, Response } from 'express'
import * as express from 'express'
import db from '../database/conn'
import ad from '../database/ad_db'
import conexao_ad from '../conexao_ad'
import { ActiveDirectory } from 'node-ad-tools'

const acc = express.Router()

export default {
  async busca(request: Request, response: Response) {
    const call = await db('users').select('*').where({ group: 'OPERACIONAL' })

    if (call) {
      return response.status(200).json(JSON.parse(JSON.stringify(call)))
    } else {
      return response.status(400).json({ status_message: 'Ocorreu um erro' })
    }
  },
  async all(request: Request, response: Response) {
    const sql = await db('users').select(
      'id',
      'name',
      'cargo',
      'email',
      'group',
      'matricula'
    )

    const superU = await db('super_user')
      .select(
        'super_id',
        'user_id',
        'name',
        'cargo',
        'email',
        'group',
        'matricula'
      )
      .innerJoin('users', 'super_user.user_id', '=', 'users.id')
    // SELECT super_id, user_id FROM super_user INNER JOIN users ON super_user.user_id=users.id

    if (superU) {
      return response.status(200).send(JSON.parse(JSON.stringify(superU)))
    } else {
      return response
        .status(404)
        .send({ status_message: 'Ocorreu um erro ao buscar usuários' })
    }
  },
  async edit(request: Request, response: Response) {
    const { super_id, user_id } = request.body
    const sql = await db('super_user').update({ super_id }).where({ user_id })

    if (sql) {
      return response.status(200).send({ status_message: 'Sucess' })
    } else {
      return response.status(400).send({ status_message: 'Error' })
    }
  }
}
