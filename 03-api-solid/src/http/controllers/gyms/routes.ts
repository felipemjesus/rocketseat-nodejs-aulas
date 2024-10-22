import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create/create-controller'

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms', create)
}
