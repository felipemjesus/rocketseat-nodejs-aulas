import { FastifyInstance } from 'fastify'
import { createUser } from './controllers/users-controller'
import { authenticate } from './controllers/authenticate-controller'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', createUser)
  app.post('/sessions', authenticate)

  app.get('/', () => {
    return 'API SOLID'
  })
}
