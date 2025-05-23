import {
  Controller,
  Get,
  Query,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { DocumentService } from './document.service';

import {} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
import { diskStorage as MulterFile } from 'multer';
import * as path from 'path';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('highlight')
  async highlightKeywords(
    @Query('file') file: string,
    @Query('keywords') keywords: string,
  ): Promise<string> {
    // const keywordList = keywords.split(',');
    const keywordList = keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    return this.documentService.readAndHighlight(file, keywordList);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterFile({
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
