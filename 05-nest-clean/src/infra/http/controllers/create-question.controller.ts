import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionSchema>

const zodValidationPipe = new ZodValidationPipe(createQuestionSchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(zodValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { title, content } = createQuestionSchema.parse(body)

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: user.sub,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
