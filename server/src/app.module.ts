import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentController } from './document/document.controller';
import { DocumentService } from './document/document.service';
import { ResumeController } from './resume/resume.controller';
import { ResumeService } from './resume/resume.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ makes config accessible in all modules
    }),
  ],
  controllers: [AppController, DocumentController, ResumeController],
  providers: [AppService, DocumentService, ResumeService],
})
export class AppModule {}
