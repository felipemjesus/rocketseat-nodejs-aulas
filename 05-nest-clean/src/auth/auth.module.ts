import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Env } from '@/env'
import { FileModule } from '@/services/file/file.module'
import { FileService } from '@/services/file/file.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    FileModule,
    JwtModule.registerAsync({
      inject: [ConfigService, FileService],
      global: true,
      useFactory: async (
        configService: ConfigService<Env, true>,
        fileService: FileService,
      ) => ({
        privateKey: await fileService.readFile(
          configService.get('JWT_PRIVATE_KEY', { infer: true }),
        ),
        publicKey: await fileService.readFile(
          configService.get('JWT_PUBLIC_KEY', { infer: true }),
        ),
        signOptions: { algorithm: 'RS256' },
      }),
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
