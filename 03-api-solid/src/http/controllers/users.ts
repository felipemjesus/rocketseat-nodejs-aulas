import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UsersService } from '@/services/users-service'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export const createUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const createUserBody = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = createUserBody.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const usersService = new UsersService(usersRepository)

    const user = await usersService.create({
      name,
      email,
      password,
    })

    return reply.status(201).send(user)
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message })
    }
  }
}
