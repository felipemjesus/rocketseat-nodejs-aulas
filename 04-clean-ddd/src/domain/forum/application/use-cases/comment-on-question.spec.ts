import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let commentOnQuestion: CommentOnQuestionUseCase

describe('Create Comment On Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    commentOnQuestion = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentRepository,
    )
  })

  it('should be able to create comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionRepository.create(question)

    await commentOnQuestion.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Conteúdo do comentário',
    })

    expect(inMemoryQuestionCommentRepository.items[0].content).toEqual(
      'Conteúdo do comentário',
    )
  })
})
