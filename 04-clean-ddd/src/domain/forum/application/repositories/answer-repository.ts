import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswerRepository {
  findById(answerId: string): Promise<Answer | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>
  create(answer: Answer): Promise<void>
  save(question: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
}
