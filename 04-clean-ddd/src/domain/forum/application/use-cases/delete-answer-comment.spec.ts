import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let deleteAnswerComment: DeleteAnswerCommentUseCase

describe('Delete Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    deleteAnswerComment = new DeleteAnswerCommentUseCase(
      inMemoryAnswerCommentRepository,
    )
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentRepository.create(answerComment)

    await deleteAnswerComment.execute({
      answerContentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)
  })

  it('should be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await inMemoryAnswerCommentRepository.create(answerComment)

    expect(() =>
      deleteAnswerComment.execute({
        answerContentId: answerComment.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
