import 'es6-shim';
import 'reflect-metadata';

import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AggregationBucket {

  @Expose({ name: 'key' })
  public key!: string;

  @Expose({ name: 'doc_count' })
  public count!: number;

}
