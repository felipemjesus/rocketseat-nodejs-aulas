import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxNumberOfCheckInsError } from '../errors/max-number-of-check-ins-error'
import { MaxDistanceError } from '../errors/max-distance-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from '../errors/late-check-in-validation-error'

interface CreateCheckinRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckinResponse {
  checkIn: CheckIn
}

interface GetAllHistoryByUser {
  userId: string
  page: number
}

interface GetAllHistoryByUserResponse {
  checkIns: CheckIn[]
}

interface GetMetricsByUserId {
  userId: string
}

interface GetMetricsByUserIdResponse {
  checkInsCount: number
}

interface ValidateCheckInRequest {
  checkInId: string
}

export class CheckInsService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async create({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CreateCheckinRequest): Promise<CheckinResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )
    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return { checkIn }
  }

  async getAllHistoryByUser({
    userId,
    page = 1,
  }: GetAllHistoryByUser): Promise<GetAllHistoryByUserResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )
    return { checkIns }
  }

  async getMetricsByUserId({
    userId,
  }: GetMetricsByUserId): Promise<GetMetricsByUserIdResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)
    return { checkInsCount }
  }

  async validateCheckIn({
    checkInId,
  }: ValidateCheckInRequest): Promise<CheckinResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckIn = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckIn > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
