require('dotenv').config();

import moment from 'moment-timezone';
import bodybuilder from 'bodybuilder';
import yaml from 'yaml';

import * as path from 'path';
import * as fs from 'fs';

import { Client } from 'elasticsearch';
import {plainToClass} from 'class-transformer';
import {SearchHit, AggregationResult, IDocumentSearch, ISearchResult} from './types';

export type Entry<T extends Record<any, any>> = { [K in keyof T]: [K, T[K]] };
export type Entries<T extends Record<any, any>> = Entry<T>[keyof T][]

const constants = {
  dateFormat: 'YYYY-MM-DD HH:MM:SS.ssssss',
}

const elasticCredentials = process.env.NEXT_PUBLIC_APPBASE_CREDENTIALS;
const [ elasticUsername, elasticPassword ] = elasticCredentials!.split(':');

const elasticSearch = {
  index: process.env.NEXT_PUBLIC_APPBASE_APP,
  credentials: elasticCredentials,
  auth: {
    username: elasticUsername,
    password: elasticPassword,
  },
  endpoint: process.env.NEXT_PUBLIC_APPBASE_URL,
  enableAppBase: process.env.NEXT_PUBLIC_ENABLE_APPBASE,
};

function useElasticClient() {
  const { auth, endpoint } = elasticSearch;
  const url = new URL(endpoint!);
  url.password = auth.password;
  url.username = auth.username;

  const host = url.toString();

  return new Client({ host, apiVersion: '7.4' });
}

function useElasticIndex() {
  const { index } = elasticSearch;
  return index;
}

export function buildQuery(params: IDocumentSearch): bodybuilder.Bodybuilder {
  const { page, pageSize, sortBy, sortOrder } = params;

  const from = (page - 1) * pageSize;

  const query = bodybuilder()
    .rawOption('_source', { excludes: ['source'] })
    .from(from)
    .size(pageSize);

  if (!!sortBy) {
    query.sort([{ [sortBy]: sortOrder ?? 'asc' }, { _score: 'desc' }]);
  } else {
    query.sort([{ _score: 'desc' }]);
  }

  for (const [ k, v ] of Object.entries(params)) {
    switch (k) {

    case 'ids':
      query.addQuery('ids', 'values', v);
      break;

    case 'keyword':
      query.addQuery('simple_query_string', 'default_operator', 'AND', {
        fields: ['title^3', 'content^2', 'source'],
        query: v,
      });

      query.rawOption('highlight', { fields: { content: {} } });
      break;

    case 'regions':
      query.filter('terms', 'region_name.keyword', v);
      break;

    case 'locations':
      query.filter('terms', 'location_name.keyword', v);
      break;

    case 'country':
      query.filter('terms', 'country_name.keyword', v);
      break;

    case 'documentType':
      query.filter('terms', 'document_type.keyword', v);
      break;

    case 'fileType':
      query.filter('terms', 'file_type.keyword', v);
      break;
    }
  }

  const { start, end } = params.publicationDate ?? {};

  if (!!start || !!end) {
    const format = constants.dateFormat;
    const toFormatted = (a?: Date) => !!a ? moment(a).format(format) : '';
    const [ gte, lte ] = [ start, end ].map(toFormatted);
    const filter = Object.entries({ gte, lte })
      .filter(([, v]) => !!v)
      .reduce((prev, [k, v]) => ({ ...prev, [k]: v }), {});

    query.filter('range', 'publication_date.keyword', filter);
  }

  return query;
}

export async function search(params: IDocumentSearch): Promise<ISearchResult> {
  const client = useElasticClient();
  const index  = useElasticIndex();

  const query = buildQuery(params);

  if (!query.hasQuery()) {
    query.query('match_all');
  } else {
    query
      .agg('terms', 'region_name.keyword', { size: 1e5, order: { _key: 'asc' } })
      .agg('terms', 'location_name.keyword', { size: 1e5, order: { _key: 'asc' } })
      .agg('terms', 'document_type.keyword', { size: 1e5, order: { _key: 'asc' } });
  }

  const searchResult = await client.search({ index, body: query.build('7.4') });

  const { pageSize } = params;

  const { took: timeTaken } = searchResult;
  const { total } = searchResult.hits as any;

  const items        = searchResult.hits.hits.flatMap(a => plainToClass(SearchHit, a));
  const aggregations = plainToClass(AggregationResult, searchResult.aggregations! ?? {});
  const totalCount   = total.value;
  const totalPages   = Math.ceil(totalCount / pageSize);

  return { timeTaken, totalCount, totalPages, items, aggregations };
}

async function run() {
  const dataPath = path.join('./data.yml');
  const textContent = fs.readFileSync(dataPath, { encoding: 'utf8' });
  const parsed = yaml.parseDocument(textContent).toJSON() as IDocumentSearch;

  try {
    const result = await search(parsed);
    console.log(`-- Page: ${parsed.page} of ${result.totalPages} (${result.totalCount}) -- ${result.timeTaken}`)
    const text = result.items.map(({ source, score, highlight }) => 
      `${source.title}\n`
      + `  Published: ${source.publicationDate.toString()}\n`
      + `  FileType:  ${source.fileType}\n`
      + `  DocType:   ${source.documentType}\n`
      + `  Location:  ${source.locationName}\n`
      + `  Region:    ${source.regionName}\n`
      + `  Score:     ${score}\n`
      + `  Id:        ${source.id}\n`
      + `  Highlight: \n---`
      + highlight?.content.join('\n')
      + `\n----\n`
    ).join('\n\n');
    console.log(text);
  } catch (err) {
    console.error(err);
  }

}

console.clear();
run()
