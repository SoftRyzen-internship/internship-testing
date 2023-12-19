import { Injectable, NestMiddleware } from '@nestjs/common';
import { MyRequest } from '@src/types/request.interface';
import { NextFunction, Response } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: MyRequest, res: Response, next: NextFunction) {
    console.log(
      'process.env.BASE_INTERNSHIP_SITE_URL',
      process.env.BASE_INTERNSHIP_SITE_URL,
    );
    res.header(
      'Access-Control-Allow-Origin',
      process.env.BASE_INTERNSHIP_SITE_URL,
    );
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization, token-type',
    );

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  }
}
