import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersService } from '../users/users-service'

export const makeUsersService = () => {
  const usersRepository = new PrismaUsersRepository()
  const usersService = new UsersService(usersRepository)

  return usersService
}
