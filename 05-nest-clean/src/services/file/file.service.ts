import { Injectable } from '@nestjs/common'
import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'

@Injectable()
export class FileService {
  async readFile(filePath: string): Promise<string> {
    const absolutePath = resolve(process.cwd(), filePath)
    return fs.readFile(absolutePath, 'utf-8')
  }
}
