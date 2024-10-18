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

interface SearchGymsRequest {
  query: string
  page: number
}

interface GymsResponse {
  gyms: Gym[]
}

interface NearbyGymsRequest {
  userLatitude: number
  userLongitude: number
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

  async search({ query, page }: SearchGymsRequest): Promise<GymsResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }

  async getAllNearbyGyms({
    userLatitude,
    userLongitude,
  }: NearbyGymsRequest): Promise<GymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
