import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let fetchQuestionComments: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentRepository,
    )
    fetchQuestionComments = new FetchQuestionCommentsUseCase(
      inMemoryQuestionCommentRepository,
    )
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent()

    inMemoryStudentRepository.items.push(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })
    await inMemoryQuestionCommentRepository.create(comment1)

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })
    await inMemoryQuestionCommentRepository.create(comment2)

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })
    await inMemoryQuestionCommentRepository.create(comment3)

    const result = await fetchQuestionComments.execute({
      questionId: 'question-1',
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

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent()

    inMemoryStudentRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await fetchQuestionComments.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
