import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Env } from '@/env'
import { FileService } from '@/services/file/file.service'
import { z } from 'zod'

const tokenPayloadSchema = z.object({
  sub: z.string(),
})

export type TokenPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService<Env, true>,
    fileService: FileService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (
        request: Request,
        rawJwtToken: string,
        done: (error: Error | null, secretOrKey: string) => void,
      ) => {
        const publicKey = await fileService.readFile(
          configService.get('JWT_PUBLIC_KEY', { infer: true }),
        )
        done(null, publicKey)
      },
      algorithms: ['RS256'],
    })
  }

  async validate(payload: TokenPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
