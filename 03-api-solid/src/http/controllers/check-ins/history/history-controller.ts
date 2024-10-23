import { makeCheckInsService } from '@/services/factories/make-check-ins-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const history = async (request: FastifyRequest, reply: FastifyReply) => {
  const historyQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = historyQuerySchema.parse(request.query)

  const checkInsService = makeCheckInsService()

  const { checkIns } = await checkInsService.getAllHistoryByUser({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({ checkIns })
}
