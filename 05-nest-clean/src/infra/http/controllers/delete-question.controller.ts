import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('id') questionId: string,
  ) {
    const result = await this.deleteQuestion.execute({
      authorId: user.sub,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
