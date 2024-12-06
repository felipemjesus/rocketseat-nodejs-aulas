import { AnswerCommentRepository } from '../repositories/answer-comment-repository'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerContentId: string
}

interface DeleteAnswerCommentUseCaseResponse {}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    authorId,
    answerContentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentRepository.findById(answerContentId)
    if (!answerComment) {
      throw new Error('Answer comment not found')
    }

    if (authorId !== answerComment.authorId.toString()) {
      throw new Error('Not allowed')
    }

    await this.answerCommentRepository.delete(answerComment)

    return {}
  }
}
