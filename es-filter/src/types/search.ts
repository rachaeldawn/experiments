import { ElasticSortKey } from './sort-key';

export interface IDocumentSearch {
  ids?: string[];
  keyword?: string;
  regions?: string[];
  locations?: string[];

  documentType?: string[];
  country?: string[];
  fileType?: string[];

  publicationDate?: {
    start?: Date;
    end?: Date;
  };

  sortBy?: ElasticSortKey;
  sortOrder?: 'asc' | 'desc';

  pageSize: number;
  page: number;
}
