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
exports.ElasticDocument = void 0;
require("es6-shim");
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
class ElasticDocument {
}
__decorate([
    class_transformer_1.Expose({ name: 'country_code' }),
    __metadata("design:type", String)
], ElasticDocument.prototype, "countryCode", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'country_name' }),
    __metadata("design:type", String)
], ElasticDocument.prototype, "countryName", void 0);
__decorate([
    class_transformer_1.Type(() => Date),
    class_transformer_1.Expose({ name: 'created_at' }),
    __metadata("design:type", Date)
], ElasticDocument.prototype, "createdAt", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'document_type' }),
    __metadata("design:type", String)
], ElasticDocument.prototype, "documentType", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'external_id' }),
    __metadata("design:type", String)
], ElasticDocument.prototype, "externalId", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'external_url' }),
    __metadata("design:type", String)
], ElasticDocument.prototype, "externalUrl", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'file_type' }),
    __metadata("design:type", String)
], ElasticDocument.prototype, "fileType", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'id' }),
    __metadata("design:type", Number)
], ElasticDocument.prototype, "id", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'lifecycle_status' }),
    __metadata("design:type", String)
], ElasticDocument.prototype, "lifecycleStatus", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'location_id' }),
    __metadata("design:type", Number)
], ElasticDocument.prototype, "locationId", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'location_name' }),
    __metadata("design:type", String)
], ElasticDocument.prototype, "locationName", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'location_url' }),
    __metadata("design:type", String)
], ElasticDocument.prototype, "locationUrl", void 0);
__decorate([
    class_transformer_1.Type(() => Date),
    class_transformer_1.Expose({ name: 'publication_date' }),
    __metadata("design:type", Date)
], ElasticDocument.prototype, "publicationDate", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'region_name' }),
    __metadata("design:type", String)
], ElasticDocument.prototype, "regionName", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'status' }),
    __metadata("design:type", String)
], ElasticDocument.prototype, "status", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'title' }),
    __metadata("design:type", String)
], ElasticDocument.prototype, "title", void 0);
__decorate([
    class_transformer_1.Type(() => Date),
    class_transformer_1.Expose({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ElasticDocument.prototype, "updatedAt", void 0);
exports.ElasticDocument = ElasticDocument;
