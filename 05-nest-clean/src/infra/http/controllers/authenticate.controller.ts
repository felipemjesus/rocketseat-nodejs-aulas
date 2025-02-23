import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authnticate-student'

const authenticateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof authenticateSchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateSchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = authenticateSchema.parse(body)

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      throw new UnauthorizedException()
    }

    return {
      access_token: result.value.accessToken,
    }
  }
}
