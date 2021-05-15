import 'es6-shim';
import 'reflect-metadata';

import { Exclude, Expose, Type } from 'class-transformer';
import { Aggregation } from './aggregation';

@Exclude()
export class AggregationResult {
  @Type(() => Aggregation)
  @Expose({ name: 'locations' })
  public locations!: Aggregation;

  @Type(() => Aggregation)
  @Expose({ name: 'regions' })
  public regions!: Aggregation;

  @Type(() => Aggregation)
  @Expose({ name: 'documentTypes' })
  public documentTypes!: Aggregation;
}
