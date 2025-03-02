import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { FakeUploader } from 'test/storage/faker-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'

let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase
let fakeUploader: FakeUploader

describe('Upload and create attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
    fakeUploader = new FakeUploader()
    uploadAndCreateAttachment = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await uploadAndCreateAttachment.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid mime type', async () => {
    const result = await uploadAndCreateAttachment.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
