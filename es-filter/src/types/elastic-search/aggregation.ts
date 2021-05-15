import 'es6-shim';
import 'reflect-metadata';

import { Exclude, Expose, Type } from 'class-transformer';
import { AggregationBucket } from './bucket';

@Exclude()
export class Aggregation {
  @Expose({ name: 'doc_count_error_upper_bound' })
  public errorUpperLimit!: number;

  @Expose({ name: 'sum_other_doc_count' })
  public otherDocs!: number;

  @Type(() => AggregationBucket)
  @Expose({ name: 'buckets' })
  public buckets!: AggregationBucket[];
}
