import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

const editQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionSchema>

const zodValidationPipe = new ZodValidationPipe(editQuestionSchema)

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(zodValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: TokenPayload,
    @Param('id') questionId: string,
  ) {
    const { title, content } = editQuestionSchema.parse(body)

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: user.sub,
      attachmentsIds: [],
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
