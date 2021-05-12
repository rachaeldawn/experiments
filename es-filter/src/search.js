require('dotenv').config();
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

const { Client } = require('elasticsearch');
const bodybuilder = require('bodybuilder');

const elasticCredentials = process.env.NEXT_PUBLIC_APPBASE_CREDENTIALS;
const [ elasticUsername, elasticPassword ] = elasticCredentials.split(':');

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
  const url = new URL(endpoint);
  url.password = auth.password;
  url.username = auth.username;

  const host = url.toString();

  return new Client({ host, apiVersion: '7.4' });
}

function useElasticIndex() {
  const { index } = elasticSearch;
  return index;
}

async function filters() {
  const client = useElasticClient();
  const index = useElasticIndex();

  const options = { size: 10000, order: { _key: 'asc' } };

  const body = bodybuilder()
    .rawOption('_source', { includes: ['*'], excludes: ['content'] })
    .agg('terms', 'region_name.keyword', options)
    .agg('terms', 'location_name.keyword', options)
    .agg('terms', 'document_type.keyword', options)
    .build('7.4');

  const request = { index, body };
  const results = await client.search(request);
  console.log('Time taken: ', results.took);
  console.log(JSON.stringify(results.aggregations, null, 4));
}

async function search(arg) {
  const { ids, keyword, regions, locations, sortBy, sortOrder } = arg;
  const { page, pageSize } = arg;

  const client = useElasticClient();
  const index = useElasticIndex();

  const from = (page - 1) * pageSize;

  const sort = [{ _score: 'desc' }];
  if (!!sortBy) {
    sort.push({[sortBy]: sortOrder ?? 'ASC'});
  }

  const mainQuery = bodybuilder()
    .rawOption('_source', { excludes: ['source'] })
    .sort(sort)
    .from(from)
    .size(pageSize)
    .agg('terms', 'region_name.keyword', { size: 1e5, order: { _key: 'asc' } })
    .agg('terms', 'location_name.keyword', { size: 1e5, order: { _key: 'asc' } })
    .agg('terms', 'document_type.keyword', { size: 1e5, order: { _key: 'asc' } })

  if (ids != null) {
    mainQuery.addQuery('ids', 'values', ids);
  }

  if (!!keyword) {
    mainQuery.addQuery('simple_query_string', 'default_operator', 'AND', {
      fields: ['title^3', 'content^2', 'source'],
      query: keyword,
    });

    mainQuery.rawOption('highlight', { fields: { content: {} } });
  }

  if (!!regions) {
    mainQuery.filter('terms', 'region_name.keyword', regions);
  }

  if (!!locations) {
    mainQuery.filter('terms', 'location_name.keyword', locations);
  }

  if (!mainQuery.hasQuery()) {
    mainQuery.query('match_all');
  }

  console.log(JSON.stringify(mainQuery.build('7.4'), null, 4))
  const searchResult = await client.search({ index, body: mainQuery.build('7.4') });
  console.log(JSON.stringify(searchResult.aggregations, null, 2))

  const items = searchResult.hits.hits;
  console.log(JSON.stringify(items, null, 2))

  const { total } = searchResult.hits;

  const totalCount = total.value;
  const totalPages = Math.ceil(totalCount / pageSize);

  return { timeTaken: searchResult.took, totalCount, totalPages, items };
}

async function run() {
  const dataPath = path.join(__dirname, 'data.yml');
  const textContent = fs.readFileSync(dataPath, { encoding: 'utf8' });
  const parsed = yaml.parseDocument(textContent).toJSON();
  console.log(`\n---- START\n${textContent}\n---- END\n`)

  await search(parsed);
}

filters()
