import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface CreateCheckinRequest {
  userId: string
  gymId: string
}

interface CheckinResponse {
  checkIn: CheckIn
}

export class CheckInsService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async create({
    userId,
    gymId,
  }: CreateCheckinRequest): Promise<CheckinResponse> {
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return { checkIn }
  }
}
