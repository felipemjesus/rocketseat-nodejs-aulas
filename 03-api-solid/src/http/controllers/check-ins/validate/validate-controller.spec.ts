import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user'

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in', async () => {
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

    const responseCreateCheckIn = await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -15.6278468,
        longitude: -47.6750529,
      })

    const { id: checkInId } = responseCreateCheckIn.body.checkIn

    const response = await request(app.server)
      .patch(`/check-ins/${checkInId}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)
  })
})
