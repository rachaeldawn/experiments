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
exports.Aggregation = void 0;
require("es6-shim");
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const bucket_1 = require("./bucket");
let Aggregation = class Aggregation {
};
__decorate([
    class_transformer_1.Expose({ name: 'doc_count_error_upper_bound' }),
    __metadata("design:type", Number)
], Aggregation.prototype, "errorUpperLimit", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'sum_other_doc_count' }),
    __metadata("design:type", Number)
], Aggregation.prototype, "otherDocs", void 0);
__decorate([
    class_transformer_1.Type(() => bucket_1.AggregationBucket),
    class_transformer_1.Expose({ name: 'buckets' }),
    __metadata("design:type", Array)
], Aggregation.prototype, "buckets", void 0);
Aggregation = __decorate([
    class_transformer_1.Exclude()
], Aggregation);
exports.Aggregation = Aggregation;
