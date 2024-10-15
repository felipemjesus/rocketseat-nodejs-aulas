import { FastifyInstance } from 'fastify'
import { createUser } from './controllers/users'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', createUser)
}
