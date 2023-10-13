import { Injectable, ValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WSValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors = []) => {
      if (this.isDetailedOutputDisabled) {
        return new WsException({
          error: 'Bad request',
          type: 'VALIDATION_EXCEPTION',
        });
      }
      const errors = this.flattenValidationErrors(validationErrors);

      return new WsException({ error: errors, type: 'VALIDATION_EXCEPTION' });
    };
  }
}
