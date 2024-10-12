import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'

export const app = fastify()

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'j@j.com',
  },
})

app.get('/', () => {
  return 'API SOLID'
})
