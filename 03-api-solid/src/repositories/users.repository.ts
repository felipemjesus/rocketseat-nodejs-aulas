import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class UsersRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({ data })
  }
}
