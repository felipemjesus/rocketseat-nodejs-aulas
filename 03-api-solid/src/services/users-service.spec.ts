import { describe, expect, it } from 'vitest'
import { UsersService } from './users-service'
import { compare } from 'bcryptjs'

describe('User', () => {
  it('should hash user password upon registration', async () => {
    const usersService = new UsersService({
      findByEmail: async () => null,
      create: async (data) => {
        return {
          id: '1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

    const { user } = await usersService.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
