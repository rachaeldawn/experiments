import 'es6-shim';
import 'reflect-metadata';

import { Expose } from 'class-transformer';

export class SearchHighlight {
  @Expose()
  public content!: string[];
}
