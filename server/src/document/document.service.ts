import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as Tesseract from 'tesseract.js';
import * as path from 'path';

@Injectable()
export class DocumentService {
  async readAndHighlight(
    filePath: string,
    keywords: string[],
  ): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();

    let rawText: string;

    switch (ext) {
      case '.pdf':
        rawText = await this.readPDF(filePath);
        break;
      case '.docx':
        rawText = await this.readDocx(filePath);
        break;
      case '.jpg':
      case '.jpeg':
      case '.png':
        rawText = await this.readImageOCR(filePath);
        break;
      default:
        throw new Error('Unsupported file format');
    }

    return this.highlightKeywords(rawText, keywords);
  }

  private async readPDF(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  private async readDocx(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  private async readImageOCR(filePath: string): Promise<string> {
    const {
      data: { text },
    } = await Tesseract.recognize(filePath, 'eng');
    return text;
  }

  private highlightKeywords(text: string, keywords: string[]): string {
    keywords.forEach((keyword) => {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex chars
      const regex = new RegExp(`\\b(${escaped})\\b`, 'gi'); // match full words
      text = text.replace(regex, '<mark>$1</mark>');
    });
    return text;
  }
}
