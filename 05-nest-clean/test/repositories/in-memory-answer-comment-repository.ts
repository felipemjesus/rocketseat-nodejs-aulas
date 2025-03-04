import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { InMemoryStudentRepository } from './in-memory-student-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = []

  constructor(private studentRepository: InMemoryStudentRepository) {}

  async findById(answerCommentId: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find(
      (item) => item.id.toString() === answerCommentId,
    )
    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((answerComment) => {
        const author = this.studentRepository.items.find((student) =>
          student.id.equals(answerComment.authorId),
        )

        if (!author) {
          throw new Error(
            `Author with ID ${answerComment.authorId} doesn't exist`,
          )
        }

        return CommentWithAuthor.create({
          commentId: answerComment.id,
          content: answerComment.content,
          authorId: answerComment.authorId,
          authorName: author.name,
          createdAt: answerComment.createdAt,
          updatedAt: answerComment.updatedAt,
        })
      })

    return answerComments
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const index = this.items.findIndex((item) => item.id === answerComment.id)
    this.items.splice(index, 1)
  }
}
