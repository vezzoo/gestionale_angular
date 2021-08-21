import { Pipe, PipeTransform } from '@angular/core';
import { ApiError } from 'src/types/api-error';
import { ConfigurationsService } from '../services/configurations.service';

@Pipe({ name: 'translateError' })
export class TranslateErrorPipe implements PipeTransform {
  constructor(private configurationsService: ConfigurationsService) {}

  transform(value: ApiError): string {
    return (
      this.configurationsService.errorTranslations[value.ecode] || value.message
    );
  }
}
