import { Uploader } from '@/domain/forum/application/storage/uploader'
import { Module } from '@nestjs/common'
import { CloudinaryStorage } from './cloudinary-storage'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: CloudinaryStorage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
