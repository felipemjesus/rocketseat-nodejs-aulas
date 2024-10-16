import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CheckInsService } from './check-ins-service'

let checkInsRepository: InMemoryCheckInsRepository
let checkInsService: CheckInsService

describe('CheckInsService', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    checkInsService = new CheckInsService(checkInsRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInsService.create({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
