import { IAggregationBucket } from './elastic-search';

export interface IFilter {
  key: string;
  count: number;
}

export interface ISearchFilters {
  regions: IAggregationBucket[];
  locations: IAggregationBucket[];
  documentTypes: IAggregationBucket[];
}
