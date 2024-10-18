import { beforeEach, describe, expect, it } from 'vitest'
import { GymsService } from './gyms-service'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let gymsService: GymsService

describe('GymsService', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    gymsService = new GymsService(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await gymsService.create({
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -15.8044667,
      longitude: -47.9524676,
    })

    expect(gym.id).toEqual(expect.any(String))
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: `JavaScript Gym`,
      description: '',
      phone: '',
      latitude: -15.8044667,
      longitude: -47.9524676,
    })

    await gymsRepository.create({
      title: `TypeScript Gym`,
      description: '',
      phone: '',
      latitude: -15.8044667,
      longitude: -47.9524676,
    })

    const { gyms } = await gymsService.search({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })

  it('should be able to fetch paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: '',
        phone: '',
        latitude: -15.8044667,
        longitude: -47.9524676,
      })
    }

    const { gyms } = await gymsService.search({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ])
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: `Near Gym`,
      description: '',
      phone: '',
      latitude: -15.8044667,
      longitude: -47.9524676,
    })

    await gymsRepository.create({
      title: `Far Gym`,
      description: '',
      phone: '',
      latitude: -15.6278468,
      longitude: -47.6750529,
    })

    const { gyms } = await gymsService.getAllNearbyGyms({
      userLatitude: -15.8044667,
      userLongitude: -47.9524676,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
