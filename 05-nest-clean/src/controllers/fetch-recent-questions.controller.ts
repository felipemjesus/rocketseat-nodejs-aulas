import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'

const pageQueryParamSchema = z.coerce.number().min(1).optional().default(1)

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(201)
  async handle(@Query('page', pageValidationPipe) page: PageQueryParam) {
    const perPage = 1

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { questions }
  }
}
