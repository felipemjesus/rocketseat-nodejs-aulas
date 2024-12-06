import { QuestionCommentRepository } from '../repositories/question-comment-repository'

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionContentId: string
}

interface DeleteQuestionCommentUseCaseResponse {}

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    authorId,
    questionContentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentRepository.findById(questionContentId)
    if (!questionComment) {
      throw new Error('Question comment not found')
    }

    if (authorId !== questionComment.authorId.toString()) {
      throw new Error('Not allowed')
    }

    await this.questionCommentRepository.delete(questionComment)

    return {}
  }
}
