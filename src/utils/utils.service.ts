import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  pascalize(word: string) {
    return word
      .trim()
      .split(' ')
      .map((word) =>
        (word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).trim(),
      )
      .join(' ');
  }
}
