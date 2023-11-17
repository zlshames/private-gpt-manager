import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { FilesystemService } from './filesystem.service';
import { RequireJsonMiddleware } from 'src/middleware/require-json.middleware';

@Module({
  providers: [
    FilesystemService,
  ],
})
export class FileSystemModule {
  constructor(
    private readonly filesystemService: FilesystemService
  ) {
    this.filesystemService.setup();
  }
}