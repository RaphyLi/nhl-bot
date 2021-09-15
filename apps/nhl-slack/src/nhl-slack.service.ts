import { Injectable } from '@nestjs/common';

@Injectable()
export class NhlSlackService {
  getHello(): string {
    return 'Hello World!';
  }
}
