import { Either, left, right } from '@/core/either'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerContentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<string, {}>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    authorId,
    answerContentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentRepository.findById(answerContentId)
    if (!answerComment) {
      return left('Answer comment not found')
    }

    if (authorId !== answerComment.authorId.toString()) {
      return left('Not allowed')
    }

    await this.answerCommentRepository.delete(answerComment)

    return right({})
  }
}
