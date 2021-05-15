import type { SearchResponse as ElasticSearchResponse } from 'elasticsearch';

export type DocType = 'minutes' | 'document';
export type LifecycleStatus = 'active';

export interface IElasticDocument {
  id: number;
  createdAt: Date;
  countryCode: string;
  countryName: string;
  documentType: string;
  externalUrl: string;
  fileType: string;
  locationId: number;
  locationName: string;
  locationUrl: string;
  publicationDate: Date;
  regionName: string;
  status: string;
  title: string;
  updatedAt: Date;
}

export type SearchResponse = ElasticSearchResponse<IElasticDocument>;

export interface IAggregationBucket {
  key: string;
  count: number;
}

export interface IAggregation {
  errorUpperLimit: number;
  otherDocs: number;
  buckets: IAggregationBucket[];
}
