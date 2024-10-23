import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create/create-controller'
import { search } from './search/search-controller'
import { nearby } from './nearby/nearby-controller'

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms', create)

  app.get('/gyms/search', search)

  app.get('/gyms/nearby', nearby)
}
