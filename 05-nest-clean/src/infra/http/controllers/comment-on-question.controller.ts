import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

const commentOnQuestionSchema = z.object({
  content: z.string(),
})

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionSchema>

const zodValidationPipe = new ZodValidationPipe(commentOnQuestionSchema)

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @Body(zodValidationPipe) body: CommentOnQuestionBodySchema,
    @CurrentUser() user: TokenPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content } = commentOnQuestionSchema.parse(body)

    const result = await this.commentOnQuestion.execute({
      authorId: user.sub,
      questionId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
