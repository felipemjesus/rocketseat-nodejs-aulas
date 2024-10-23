import { beforeEach, describe, expect, it } from 'vitest'
import { UsersService } from './users-service'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let usersService: UsersService

describe('UsersService', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    usersService = new UsersService(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await usersService.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
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

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await usersService.create({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      usersService.create({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to get user profile', async () => {
    const { user } = await usersService.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const { user: userProfile } = await usersService.getUserProfile({
      userId: user.id,
    })

    expect(userProfile.id).toEqual(expect.any(String))
    expect(userProfile.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      usersService.getUserProfile({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
