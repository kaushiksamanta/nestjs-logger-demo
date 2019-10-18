import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class UpperCasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
      if (Array.isArray(value.payload) && metadata.type === 'body') {
        return value.payload.map((val: string) => val.toUpperCase());
      }
      throw new BadRequestException('Validation failed');
  }
}
