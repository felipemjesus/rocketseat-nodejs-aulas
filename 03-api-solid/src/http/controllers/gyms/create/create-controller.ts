import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGymsService } from '@/services/factories/make-gyms-service'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createGymBody = z.object({
    title: z.string(),
    description: z.string(),
    phone: z.string(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBody.parse(request.body)

  const gymsService = makeGymsService()

  const { gym } = await gymsService.create({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send({ gym })
}
