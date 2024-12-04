import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let deleteAnswer: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    deleteAnswer = new DeleteAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    await deleteAnswer.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
    })

    expect(inMemoryAnswerRepository.items).toHaveLength(0)
  })

  it('should be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    expect(() =>
      deleteAnswer.execute({
        authorId: 'author-2',
        answerId: 'answer-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
