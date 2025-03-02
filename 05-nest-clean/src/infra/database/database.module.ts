import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository'
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comment-repository'
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachment-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comment-repository'
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachment-repository'
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AttachmentRepository } from '@/domain/forum/application/repositories/attachment-repository'
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository,
    },
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionCommentRepository,
    },
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionAttachmentRepository,
    },
    {
      provide: AnswerRepository,
      useClass: PrismaAnswerRepository,
    },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswerCommentRepository,
    },
    {
      provide: AnswerAttachmentRepository,
      useClass: PrismaAnswerAttachmentRepository,
    },
    {
      provide: AttachmentRepository,
      useClass: PrismaAttachmentRepository,
    },
  ],
  exports: [
    PrismaService,
    StudentRepository,
    QuestionRepository,
    QuestionCommentRepository,
    QuestionAttachmentRepository,
    AnswerRepository,
    AnswerCommentRepository,
    AnswerAttachmentRepository,
    AttachmentRepository,
  ],
})
export class DatabaseModule {}
