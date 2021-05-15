import 'es6-shim';
import 'reflect-metadata';

import { Expose, Type } from 'class-transformer';
import { DocType, IElasticDocument, LifecycleStatus } from './types';


export class ElasticDocument implements IElasticDocument {

  @Expose({ name: 'country_code' })
  public countryCode!: string

  @Expose({ name: 'country_name' })
  public countryName!: string

  @Type(() => Date)
  @Expose({ name: 'created_at' })
  public createdAt!: Date;

  @Expose({ name: 'document_type' })
  public documentType!: DocType;

  @Expose({ name: 'external_id' })
  public externalId!: string

  @Expose({ name: 'external_url' })
  public externalUrl!: string

  @Expose({ name: 'file_type' })
  public fileType!: string

  @Expose({ name: 'id' })
  public id!: number

  @Expose({ name: 'lifecycle_status' })
  public lifecycleStatus!: LifecycleStatus;

  @Expose({ name: 'location_id' })
  public locationId!: number;

  @Expose({ name: 'location_name' })
  public locationName!: string

  @Expose({ name: 'location_url' })
  public locationUrl!: string;

  @Type(() => Date)
  @Expose({ name: 'publication_date' })
  public publicationDate!: Date;

  @Expose({ name: 'region_name' })
  public regionName!: string;

  @Expose({ name: 'status' })
  public status!: string;

  @Expose({ name: 'title' })
  public title!: string;

  @Type(() => Date)
  @Expose({ name: 'updated_at' })
  public updatedAt!: Date
}

