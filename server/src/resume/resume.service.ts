// src/resume/resume.service.ts

import { Injectable, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import * as OpenAI from 'openai';

interface PDFParseResult {
  text: string;
  numpages: number;
  numrender: number;
  info: object;
  metadata: object;
  version: string;
}

@Injectable()
export class ResumeService {
  private openai = new OpenAI.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  async extractText(file: Express.Multer.File): Promise<string> {
    try {
      const data = (await pdfParse(file.buffer)) as PDFParseResult;
      return data.text;
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async processResume(file: Express.Multer.File, jd: string) {
    const resumeText = await this.extractText(file);
    const [resumeSkills, jobSkills] = await Promise.all([
      this.extractSkills(resumeText),
      this.extractSkills(jd),
    ]);

    const matched = resumeSkills.filter((skill) => jobSkills.includes(skill));
    const missing = jobSkills.filter((skill) => !resumeSkills.includes(skill));

    return {
      matched,
      missing,
      matchScore: (matched.length / jobSkills.length) * 100,
    };
  }

  async extractSkills(text: string): Promise<string[]> {
    const prompt = `Extract the core skills from this text:\n\n${text}`;
    const maxRetries = 3;
    const delayMs = 3000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-3.5-turbo',
        });

        const content = response.choices?.[0]?.message?.content;
        if (!content) {
          throw new HttpException(
            'OpenAI response is empty',
            HttpStatus.BAD_GATEWAY,
          );
        }
        return content
          .split(/[,;\n]+/)
          .map((skill) => skill.trim().toLowerCase())
          .filter((skill) => skill.length > 1);
      } catch (error: any) {
        if (error.status === 429 && attempt < maxRetries) {
          console.warn(
            `Rate limited by OpenAI. Retrying in ${delayMs}ms... (Attempt ${attempt})`,
          );
          await new Promise((res) => setTimeout(res, delayMs));
        } else {
          console.error('OpenAI Error:', error.message || error);
          throw new HttpException(
            'Failed to extract skills due to API limits or errors. Try again later.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
      }
    }

    throw new HttpException(
      'Exceeded retry limit for OpenAI API',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
