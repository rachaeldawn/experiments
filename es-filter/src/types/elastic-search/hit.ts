import 'es6-shim';
import 'reflect-metadata';

import { Exclude, Expose, Type } from 'class-transformer';
import { ElasticDocument } from './document';
import { SearchHighlight } from './highlight';

@Exclude()
export class SearchHit {
  @Expose({ name: '_id' })
  public id!: string;

  @Expose({ name: '_index' })
  public index!: string;

  @Expose({ name: '_score' })
  public score!: number;

  @Type(() => ElasticDocument)
  @Expose({ name: '_source' })
  public source!: ElasticDocument;

  @Expose({ name: 'highlight' })
  @Type(() => SearchHighlight)
  public highlight?: SearchHighlight;

  @Expose({ name: '_type' })
  public type!: string;
}
