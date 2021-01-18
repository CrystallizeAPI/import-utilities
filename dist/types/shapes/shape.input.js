"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shapeTypes = void 0;
var json_to_graphql_query_1 = require("json-to-graphql-query");
exports.shapeTypes = {
    product: new json_to_graphql_query_1.EnumType('product'),
    document: new json_to_graphql_query_1.EnumType('document'),
    folder: new json_to_graphql_query_1.EnumType('folder'),
};
