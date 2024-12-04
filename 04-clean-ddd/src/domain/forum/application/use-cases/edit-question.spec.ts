import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let editQuestion: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    editQuestion = new EditQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    await editQuestion.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      title: 'New title',
      content: 'New content',
    })

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: 'New title',
      content: 'New content',
    })
  })

  it('should be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    expect(() =>
      editQuestion.execute({
        authorId: 'author-2',
        questionId: 'question-1',
        title: 'New title',
        content: 'New content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
