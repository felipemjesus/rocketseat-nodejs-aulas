import { RegisterStudentUseCase } from './register-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryStudentRepository: InMemoryStudentRepository
let fakeHasher: FakeHasher
let registerStudent: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    fakeHasher = new FakeHasher()
    registerStudent = new RegisterStudentUseCase(
      inMemoryStudentRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new student', async () => {
    const result = await registerStudent.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await registerStudent.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentRepository.items[0].password).toEqual(hashedPassword)
  })
})
