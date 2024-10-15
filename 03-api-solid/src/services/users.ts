import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users.repository'

interface CreateUserParams {
  name: string
  email: string
  password: string
}

export const create = async ({ name, email, password }: CreateUserParams) => {
  const usersRepository = new UsersRepository()

  const userExists = await usersRepository.findByEmail(email)
  if (userExists) {
    throw new Error('User already exists.')
  }

  const password_hash = await hash(password, 6)

  const user = await usersRepository.create({
    name,
    email,
    password_hash,
  })
  return user
}
