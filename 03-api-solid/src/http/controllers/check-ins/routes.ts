import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { create } from './create/create-controller'
import { validate } from './validate/validate-controller'
import { metrics } from './metrics/metrics-controller'
import { history } from './history/history-controller'

export const checkInsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms/:gymId/check-ins', create)

  app.patch('/check-ins/:checkInId/validate', validate)

  app.get('/check-ins/metrics', metrics)

  app.get('/check-ins/history', history)
}
