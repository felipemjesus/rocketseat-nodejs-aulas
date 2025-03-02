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
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

const answerQuestionSchema = z.object({
  content: z.string(),
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionSchema>

const zodValidationPipe = new ZodValidationPipe(answerQuestionSchema)

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(zodValidationPipe) body: AnswerQuestionBodySchema,
    @CurrentUser() user: TokenPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content } = answerQuestionSchema.parse(body)

    const result = await this.answerQuestion.execute({
      authorId: user.sub,
      questionId,
      attachementsIds: [],
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
