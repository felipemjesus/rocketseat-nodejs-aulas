import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentiais-error'
import { makeAuthenticateService } from '@/services/factories/make-autheticate-service'

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authenticateBody = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBody.parse(request.body)

  try {
    const authenticateService = makeAuthenticateService()

    const user = await authenticateService.execute({
      email,
      password,
    })

    return reply.status(200).send(user)
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
