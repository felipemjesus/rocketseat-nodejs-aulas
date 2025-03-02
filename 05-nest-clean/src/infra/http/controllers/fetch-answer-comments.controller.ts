import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { CommentPresenter } from '../presenters/comment-presenter'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'

const pageQueryParamSchema = z.coerce.number().min(1).optional().default(1)

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', pageValidationPipe) page: PageQueryParam,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({
      answerId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answerComments = result.value.answerComments.map(
      CommentPresenter.toHTTP,
    )

    return { answerComments }
  }
}
