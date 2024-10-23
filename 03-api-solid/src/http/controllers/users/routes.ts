import { FastifyInstance } from 'fastify'
import { create } from './create/create-controller'
import { profile } from './profile/profile-controller'
import { authenticate } from './authenticate/authenticate-controller'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { refresh } from './refresh/refresh-controller'

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/users', create)

  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
