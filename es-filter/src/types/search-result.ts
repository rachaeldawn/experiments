import { AggregationResult, SearchHit } from './elastic-search';

export interface ISearchResult {
  items: SearchHit[];
  aggregations?: AggregationResult;
  totalCount: number;
  totalPages: number;
  timeTaken: number;
}
