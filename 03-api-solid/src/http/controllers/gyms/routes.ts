import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create/create-controller'
import { search } from './search/search-controller'
import { nearby } from './nearby/nearby-controller'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)

  app.get('/gyms/search', search)

  app.get('/gyms/nearby', nearby)
}
