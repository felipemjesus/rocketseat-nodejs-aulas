import { Comment } from '@/domain/forum/enterprise/entities/comment'

export class CommentPresenter {
  static toHTTP(comment: Comment<any>) { // eslint-disable-line
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
