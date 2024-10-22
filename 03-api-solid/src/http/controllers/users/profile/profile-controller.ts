import { FastifyReply, FastifyRequest } from 'fastify'
import { makeUsersService } from '@/services/factories/make-users-service'

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.sub

  const usersService = makeUsersService()

  const { user } = await usersService.getUserProfile({
    userId,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
