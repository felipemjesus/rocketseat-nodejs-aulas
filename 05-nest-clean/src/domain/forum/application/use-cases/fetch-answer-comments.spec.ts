import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let fetchAnswerComments: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentRepository,
    )
    fetchAnswerComments = new FetchAnswerCommentsUseCase(
      inMemoryAnswerCommentRepository,
    )
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent()

    inMemoryStudentRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })
    await inMemoryAnswerCommentRepository.create(comment1)

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })
    await inMemoryAnswerCommentRepository.create(comment2)

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })
    await inMemoryAnswerCommentRepository.create(comment3)

    const result = await fetchAnswerComments.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorName: student.name,
          commentId: comment1.id,
        }),
        expect.objectContaining({
          authorName: student.name,
          commentId: comment2.id,
        }),
        expect.objectContaining({
          authorName: student.name,
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated answer answercomments', async () => {
    const student = makeStudent()

    inMemoryStudentRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await fetchAnswerComments.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
