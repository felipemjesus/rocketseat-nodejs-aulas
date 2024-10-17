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
})
