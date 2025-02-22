import { Injectable } from '@nestjs/common'
import { promises as fs } from 'fs'
import * as path from 'path'

@Injectable()
export class FileService {
  async readFile(filePath: string): Promise<string> {
    const absolutePath = path.resolve(process.cwd(), filePath)
    return fs.readFile(absolutePath, 'utf-8')
  }
}
