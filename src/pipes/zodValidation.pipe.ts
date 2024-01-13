import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodObject, ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any> | ZodType<any>) {}

  transform(value: any) {
    try {
      this.schema.parse(value);
    } catch (error) {
      if (!(error instanceof ZodError)) {
        throw new BadRequestException('Invalid request!');
      }
      throw new BadRequestException({ errors: error.issues });
    }

    return value;
  }
}
