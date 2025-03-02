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
  constructor(private envService: EnvService) {}

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    cloudinary.config({
      cloud_name: this.envService.get('AWS_BUCKET_NAME'),
      api_key: this.envService.get('AWS_ACCESS_KEY_ID'),
      api_secret: this.envService.get('AWS_SECRET_ACCESS_KEY'),
      secure: true,
    })

    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`
    const bodyBase64 = Buffer.from(body).toString('base64')
    const dataUri = `data:${fileType};base64,${bodyBase64}`

    const resourceType = fileType.startsWith('image') ? 'image' : 'raw'

    await cloudinary.uploader.upload(dataUri, {
      public_id: uniqueFileName,
      folder: this.envService.get('AWS_FOLDER_NAME'),
      resource_type: resourceType,
    })

    return { url: uniqueFileName }
  }
}
