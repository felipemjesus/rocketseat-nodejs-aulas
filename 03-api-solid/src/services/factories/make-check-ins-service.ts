import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInsService } from '../check-ins/check-ins-service'

export const makeCheckInsService = () => {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const checkInsService = new CheckInsService(
    checkInsRepository,
    gymsRepository,
  )

  return checkInsService
}
