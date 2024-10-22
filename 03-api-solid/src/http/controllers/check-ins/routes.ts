import { FastifyInstance } from 'fastify'

export const checkInsRoutes = async (app: FastifyInstance) => {
  app.get('/check-ins', () => {
    return 'Check-ins'
  })
}
