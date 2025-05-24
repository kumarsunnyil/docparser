// document.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const baseName = path.basename(file.originalname, ext);
          cb(null, `${baseName}-${Date.now()}${ext}`);
        },
      }),
    }),
  )
  async uploadAndHighlight(
    @UploadedFile() file: Express.Multer.File,
    @Body('keywords') keywords: string,
  ): Promise<string> {
    const keywordList = keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    return this.documentService.readAndHighlight(file.path, keywordList);
  }
}
