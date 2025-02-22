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
  async handle(@Body() body: CreateQuestionBodySchema) {
    const { title } = createQuestionSchema.parse(body)

    return { title }
  }
}
