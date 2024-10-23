import { makeCheckInsService } from '@/services/factories/make-check-ins-service'
import { FastifyReply, FastifyRequest } from 'fastify'

export const metrics = async (request: FastifyRequest, reply: FastifyReply) => {
  const checkInsService = makeCheckInsService()

  const { checkInsCount } = await checkInsService.getMetricsByUserId({
    userId: request.user.sub,
  })

  return reply.status(200).send({ checkInsCount })
}
