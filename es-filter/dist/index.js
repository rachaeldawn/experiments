"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.buildQuery = void 0;
require('dotenv').config();
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const bodybuilder_1 = __importDefault(require("bodybuilder"));
const yaml_1 = __importDefault(require("yaml"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const elasticsearch_1 = require("elasticsearch");
const class_transformer_1 = require("class-transformer");
const types_1 = require("./types");
const constants = {
    dateFormat: 'YYYY-MM-DD HH:MM:SS.ssssss',
};
const elasticCredentials = process.env.NEXT_PUBLIC_APPBASE_CREDENTIALS;
const [elasticUsername, elasticPassword] = elasticCredentials.split(':');
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
    return new elasticsearch_1.Client({ host, apiVersion: '7.4' });
}
function useElasticIndex() {
    const { index } = elasticSearch;
    return index;
}
function buildQuery(params) {
    var _a;
    const { page, pageSize, sortBy, sortOrder } = params;
    const from = (page - 1) * pageSize;
    const query = bodybuilder_1.default()
        .rawOption('_source', { excludes: ['source'] })
        .from(from)
        .size(pageSize);
    if (!!sortBy) {
        query.sort([{ [sortBy]: sortOrder !== null && sortOrder !== void 0 ? sortOrder : 'asc' }, { _score: 'desc' }]);
    }
    else {
        query.sort([{ _score: 'desc' }]);
    }
    for (const [k, v] of Object.entries(params)) {
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
    const { start, end } = (_a = params.publicationDate) !== null && _a !== void 0 ? _a : {};
    if (!!start || !!end) {
        const format = constants.dateFormat;
        const toFormatted = (a) => !!a ? moment_timezone_1.default(a).format(format) : '';
        const [gte, lte] = [start, end].map(toFormatted);
        const filter = Object.entries({ gte, lte })
            .filter(([, v]) => !!v)
            .reduce((prev, [k, v]) => ({ ...prev, [k]: v }), {});
        query.filter('range', 'publication_date.keyword', filter);
    }
    return query;
}
exports.buildQuery = buildQuery;
async function search(params) {
    var _a;
    const client = useElasticClient();
    const index = useElasticIndex();
    const query = buildQuery(params);
    if (!query.hasQuery()) {
        query.query('match_all');
    }
    else {
        query
            .agg('terms', 'region_name.keyword', { size: 1e5, order: { _key: 'asc' } })
            .agg('terms', 'location_name.keyword', { size: 1e5, order: { _key: 'asc' } })
            .agg('terms', 'document_type.keyword', { size: 1e5, order: { _key: 'asc' } });
    }
    const searchResult = await client.search({ index, body: query.build('7.4') });
    const { pageSize } = params;
    const { took: timeTaken } = searchResult;
    const { total } = searchResult.hits;
    const items = searchResult.hits.hits.flatMap(a => class_transformer_1.plainToClass(types_1.SearchHit, a));
    const aggregations = class_transformer_1.plainToClass(types_1.AggregationResult, (_a = searchResult.aggregations) !== null && _a !== void 0 ? _a : {});
    const totalCount = total.value;
    const totalPages = Math.ceil(totalCount / pageSize);
    return { timeTaken, totalCount, totalPages, items, aggregations };
}
exports.search = search;
async function run() {
    const dataPath = path.join('./data.yml');
    const textContent = fs.readFileSync(dataPath, { encoding: 'utf8' });
    const parsed = yaml_1.default.parseDocument(textContent).toJSON();
    try {
        const result = await search(parsed);
        console.log(`-- Page: ${parsed.page} of ${result.totalPages} (${result.totalCount}) -- ${result.timeTaken}`);
        const text = result.items.map(({ source, score, highlight }) => `${source.title}\n`
            + `  Published: ${source.publicationDate.toString()}\n`
            + `  FileType:  ${source.fileType}\n`
            + `  DocType:   ${source.documentType}\n`
            + `  Location:  ${source.locationName}\n`
            + `  Region:    ${source.regionName}\n`
            + `  Score:     ${score}\n`
            + `  Id:        ${source.id}\n`
            + `  Highlight: \n---`
            + (highlight === null || highlight === void 0 ? void 0 : highlight.content.join('\n'))
            + `\n----\n`).join('\n\n');
        console.log(text);
    }
    catch (err) {
        console.error(err);
    }
}
console.clear();
run();
