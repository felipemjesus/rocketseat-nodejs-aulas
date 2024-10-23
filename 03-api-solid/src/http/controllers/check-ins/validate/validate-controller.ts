import { makeCheckInsService } from '@/services/factories/make-check-ins-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const validate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const checkInsService = makeCheckInsService()

  await checkInsService.validateCheckIn({
    checkInId,
  })

  return reply.status(204).send()
}
