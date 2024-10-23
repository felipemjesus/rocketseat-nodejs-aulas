import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { GymsService } from '../gyms/gyms-service'

export const makeGymsService = () => {
  const gymsRepository = new PrismaGymsRepository()
  const gymsService = new GymsService(gymsRepository)

  return gymsService
}
