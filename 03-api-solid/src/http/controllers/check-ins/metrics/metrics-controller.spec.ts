import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user'

describe('Check-in Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the count of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const responseCreateGym = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description.',
        phone: '11999999999',
        latitude: -15.6278468,
        longitude: -47.6750529,
      })

    const { id } = responseCreateGym.body.gym

    vi.setSystemTime(new Date(2024, 9, 22, 20, 0, 0))

    await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -15.6278468,
        longitude: -47.6750529,
      })

    vi.setSystemTime(new Date(2024, 9, 21, 20, 0, 0))

    await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -15.6278468,
        longitude: -47.6750529,
      })

    const response = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()

    console.log(response.body)

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkInsCount).toEqual(2)
  })
})
