import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface CreateUserParams {
  name: string
  email: string
  password: string
}

export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create({ name, email, password }: CreateUserParams) {
    const userExists = await this.usersRepository.findByEmail(email)
    if (userExists) {
      throw new Error('User already exists.')
    }

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return user
  }
}
