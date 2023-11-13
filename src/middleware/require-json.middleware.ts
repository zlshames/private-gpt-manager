import { Injectable, NestMiddleware, NotAcceptableException } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class RequireJsonMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    
    if (req.headers['content-type'] !== 'application/json') {
      throw new NotAcceptableException('Content-Type must be application/json');
    }

    next();
  }
}
