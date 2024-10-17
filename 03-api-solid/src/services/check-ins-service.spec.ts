import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInsService } from './check-ins-service'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInsService: CheckInsService

describe('CheckInsService', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInsService = new CheckInsService(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -15.8044667,
      longitude: -47.9524676,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInsService.create({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -15.8044667,
      userLongitude: -47.9524676,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 9, 16, 20, 0, 0))

    await checkInsService.create({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -15.8044667,
      userLongitude: -47.9524676,
    })

    await expect(() =>
      checkInsService.create({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -15.8044667,
        userLongitude: -47.9524676,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 9, 16, 20, 0, 0))

    await checkInsService.create({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -15.8044667,
      userLongitude: -47.9524676,
    })

    vi.setSystemTime(new Date(2024, 9, 17, 20, 0, 0))

    const { checkIn } = await checkInsService.create({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -15.8044667,
      userLongitude: -47.9524676,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-15.7541221),
      longitude: new Decimal(-47.840039),
    })

    await expect(() =>
      checkInsService.create({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -15.8044667,
        userLongitude: -47.9524676,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
