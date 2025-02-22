import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { TokenPayload } from 'src/auth/jwt.strategy'

const createQuestionSchema = z.object({
  title: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createQuestionSchema))
  async handle(
    @CurrentUser() user: TokenPayload,
    @Body() body: CreateQuestionBodySchema,
  ) {
    const { title } = createQuestionSchema.parse(body)

    return { title, user }
  }
}
