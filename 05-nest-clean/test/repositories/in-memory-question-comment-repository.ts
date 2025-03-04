import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentRepository } from './in-memory-student-repository'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = []

  constructor(private studentRepository: InMemoryStudentRepository) {}

  async findById(questionCommentId: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find(
      (item) => item.id.toString() === questionCommentId,
    )
    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((questionComment) => {
        const author = this.studentRepository.items.find((student) =>
          student.id.equals(questionComment.authorId),
        )

        if (!author) {
          throw new Error(
            `Author with ID ${questionComment.authorId} doesn't exist`,
          )
        }

        return CommentWithAuthor.create({
          commentId: questionComment.id,
          content: questionComment.content,
          authorId: questionComment.authorId,
          authorName: author.name,
          createdAt: questionComment.createdAt,
          updatedAt: questionComment.updatedAt,
        })
      })

    return questionComments
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const index = this.items.findIndex((item) => item.id === questionComment.id)
    this.items.splice(index, 1)
  }
}
