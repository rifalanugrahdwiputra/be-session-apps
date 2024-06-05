import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import multer from 'multer';

@Injectable()
export class UtilsService {
  constructor() { }

  async uploads(file: multer.File): Promise<string> {
    if (
      !file.mimetype.includes('pdf') &&
      !file.mimetype.includes('doc') &&
      !file.mimetype.includes('docx') &&
      !file.mimetype.includes('svg') &&
      !file.mimetype.includes('jpg') &&
      !file.mimetype.includes('png')
    ) {
      throw new HttpException('Invalid file format', HttpStatus.BAD_REQUEST);
    }

    const fileExtension = file.originalname.split('.').pop();
    const filename = `file_${Math.floor(Math.random() * 1000000)}_${Date.now()}.${fileExtension}`;
    const filePath = `src/assets/${filename}`;
    try {
      await fs.promises.writeFile(filePath, file.buffer);
      return filename;
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  async downloadFile(filename: string): Promise<Buffer | null> {
    const filePath = `src/assets/${filename}`;
    try {
      const fileBuffer = await fs.promises.readFile(filePath);
      return fileBuffer;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }

  checkExistsFile(filename: string): boolean {
    const filePath = `src/assets/${filename}`;
    try {
      return fs.existsSync(filePath);
    } catch (error) {
      return false;
    }
  }
}
