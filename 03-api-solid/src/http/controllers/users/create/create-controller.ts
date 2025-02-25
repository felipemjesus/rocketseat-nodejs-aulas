import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error'
import { makeUsersService } from '@/services/factories/make-users-service'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createUserBody = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = createUserBody.parse(request.body)

  try {
    const usersService = makeUsersService()

    const user = await usersService.create({
      name,
      email,
      password,
    })

    return reply.status(201).send(user)
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
