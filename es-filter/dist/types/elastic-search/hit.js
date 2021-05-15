"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchHit = void 0;
require("es6-shim");
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const document_1 = require("./document");
const highlight_1 = require("./highlight");
let SearchHit = class SearchHit {
};
__decorate([
    class_transformer_1.Expose({ name: '_id' }),
    __metadata("design:type", String)
], SearchHit.prototype, "id", void 0);
__decorate([
    class_transformer_1.Expose({ name: '_index' }),
    __metadata("design:type", String)
], SearchHit.prototype, "index", void 0);
__decorate([
    class_transformer_1.Expose({ name: '_score' }),
    __metadata("design:type", Number)
], SearchHit.prototype, "score", void 0);
__decorate([
    class_transformer_1.Type(() => document_1.ElasticDocument),
    class_transformer_1.Expose({ name: '_source' }),
    __metadata("design:type", document_1.ElasticDocument)
], SearchHit.prototype, "source", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'highlight' }),
    class_transformer_1.Type(() => highlight_1.SearchHighlight),
    __metadata("design:type", highlight_1.SearchHighlight)
], SearchHit.prototype, "highlight", void 0);
__decorate([
    class_transformer_1.Expose({ name: '_type' }),
    __metadata("design:type", String)
], SearchHit.prototype, "type", void 0);
SearchHit = __decorate([
    class_transformer_1.Exclude()
], SearchHit);
exports.SearchHit = SearchHit;
