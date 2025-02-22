import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { JwtService } from '@nestjs/jwt'

const authenticateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof authenticateSchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateSchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = authenticateSchema.parse(body)

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    let isPasswordValid = false

    if (user) {
      isPasswordValid = await compare(password, user.password)
    }

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
    })

    return {
      access_token: accessToken,
    }
  }
}
