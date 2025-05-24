// src/resume/resume.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('resume'))
  uploadResume(
    @UploadedFile() file: Express.Multer.File,
    @Body('jobDescription') jd: string,
  ) {
    return this.resumeService.processResume(file, jd);
  }
}
