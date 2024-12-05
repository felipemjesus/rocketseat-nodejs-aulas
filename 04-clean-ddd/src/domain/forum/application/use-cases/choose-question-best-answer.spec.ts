import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase

describe('Choose question best answer', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    chooseQuestionBestAnswer = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswerRepository,
    )
  })

  it('should be able to choose a question best answer', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    await chooseQuestionBestAnswer.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should be able to choose another question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    })
    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    expect(() =>
      chooseQuestionBestAnswer.execute({
        answerId: answer.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
