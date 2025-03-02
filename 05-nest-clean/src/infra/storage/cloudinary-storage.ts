import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'
import { v2 as cloudinary } from 'cloudinary'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CloudinaryStorage implements Uploader {
  constructor(private envService: EnvService) {
    const awsBucketName = this.envService.get('AWS_BUCKET_NAME')
    const awsAccessKeyId = this.envService.get('AWS_ACCESS_KEY_ID')
    const awsSecretAccessKey = this.envService.get('AWS_SECRET_ACCESS_KEY')

    cloudinary.config({
      cloud_name: awsBucketName,
      api_key: awsAccessKeyId,
      api_secret: awsSecretAccessKey,
    })
  }

  async upload({ fileName, body }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await cloudinary.uploader.upload(body.toString('base64'), {
      public_id: uniqueFileName,
      resource_type: 'auto',
    })

    return { url: uniqueFileName }
  }
}
