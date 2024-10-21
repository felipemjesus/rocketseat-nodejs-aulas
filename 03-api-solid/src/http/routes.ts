import { FastifyInstance } from 'fastify'
import { createUser, getUserProfile } from './controllers/users-controller'
import { authenticate } from './controllers/authenticate-controller'
import { verifyJwt } from './middlewares/verify-jwt'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', createUser)
  app.post('/sessions', authenticate)

  app.get('/me', { onRequest: [verifyJwt] }, getUserProfile)

  app.get('/', () => {
    return 'API SOLID'
  })
}
