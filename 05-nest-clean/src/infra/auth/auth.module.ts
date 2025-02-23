import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { FileModule } from '@/infra/file/file.module'
import { FileService } from '@/infra/file/file.service'
import { JwtStrategy } from './jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'
import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [
    PassportModule,
    FileModule,
    EnvModule,
    JwtModule.registerAsync({
      imports: [FileModule, EnvModule],
      inject: [EnvService, FileService],
      global: true,
      useFactory: async (envService: EnvService, fileService: FileService) => ({
        privateKey: await fileService.readFile(
          envService.get('JWT_PRIVATE_KEY'),
        ),
        publicKey: await fileService.readFile(envService.get('JWT_PUBLIC_KEY')),
        signOptions: { algorithm: 'RS256' },
      }),
    }),
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
