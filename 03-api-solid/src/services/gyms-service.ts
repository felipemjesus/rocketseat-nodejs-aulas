import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface CreateGymRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface GymResponse {
  gym: Gym
}

export class GymsService {
  constructor(private gymsRepository: GymsRepository) {}

  async create({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymRequest): Promise<GymResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return { gym }
  }
}
