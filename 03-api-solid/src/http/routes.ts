import { FastifyInstance } from 'fastify'
import { createUser, getUserProfile } from './controllers/users-controller'
import { authenticate } from './controllers/authenticate-controller'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', createUser)
  app.post('/sessions', authenticate)

  app.get('/me', getUserProfile)

  app.get('/', () => {
    return 'API SOLID'
  })
}
