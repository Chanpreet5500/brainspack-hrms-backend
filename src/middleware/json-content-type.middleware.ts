import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JsonContentTypeMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (['POST', 'PUT'].includes(req.method)) {
            const contentType = req.headers['content-type'];
            if (contentType !== 'application/json') {
                throw new HttpException(
                    'Content-Type must be application/json',
                    HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                );
            }
        }
        next();
    }
}
