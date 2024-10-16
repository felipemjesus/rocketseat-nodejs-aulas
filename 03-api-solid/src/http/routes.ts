import { FastifyInstance } from 'fastify'
import { createUser } from './controllers/users-controller'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', createUser)

  app.get('/', () => {
    return 'API SOLID'
  })
}
