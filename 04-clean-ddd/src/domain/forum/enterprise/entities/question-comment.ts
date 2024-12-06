import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Comment } from './comment'

export interface QuestionCommentProps extends Comment<QuestionCommentProps> {
  questionId: UniqueEntityId
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return questionComment
  }
}
