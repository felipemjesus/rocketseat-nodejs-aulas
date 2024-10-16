import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface CreateUserParams {
  name: string
  email: string
  password: string
}

interface CreateUserResponse {
  user: User
}

export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create({
    name,
    email,
    password,
  }: CreateUserParams): Promise<CreateUserResponse> {
    const userExists = await this.usersRepository.findByEmail(email)
    if (userExists) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
