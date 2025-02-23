import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository'
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comment-repository'
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachment-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comment-repository'
import { PrismaNotificationRepository } from './prisma/repositories/prisma-notification-repository'
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'

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
    PrismaQuestionCommentRepository,
    PrismaQuestionAttachmentRepository,
    PrismaAnswerRepository,
    PrismaAnswerCommentRepository,
    PrismaQuestionAttachmentRepository,
    PrismaNotificationRepository,
  ],
  exports: [
    PrismaService,
    StudentRepository,
    QuestionRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionAttachmentRepository,
    PrismaAnswerRepository,
    PrismaAnswerCommentRepository,
    PrismaQuestionAttachmentRepository,
    PrismaNotificationRepository,
  ],
})
export class DatabaseModule {}
