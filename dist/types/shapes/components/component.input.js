"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentTypes = void 0;
var json_to_graphql_query_1 = require("json-to-graphql-query");
exports.componentTypes = {
    boolean: new json_to_graphql_query_1.EnumType('boolean'),
    componentChoice: new json_to_graphql_query_1.EnumType('componentChoice'),
    contentChunk: new json_to_graphql_query_1.EnumType('contentChunk'),
    datetime: new json_to_graphql_query_1.EnumType('datetime'),
    gridRelations: new json_to_graphql_query_1.EnumType('gridRelations'),
    images: new json_to_graphql_query_1.EnumType('images'),
    itemRelations: new json_to_graphql_query_1.EnumType('itemRelations'),
    location: new json_to_graphql_query_1.EnumType('location'),
    numeric: new json_to_graphql_query_1.EnumType('numeric'),
    paragraphCollection: new json_to_graphql_query_1.EnumType('paragraphCollection'),
    propertiesTable: new json_to_graphql_query_1.EnumType('propertiesTable'),
    richText: new json_to_graphql_query_1.EnumType('richText'),
    singleLine: new json_to_graphql_query_1.EnumType('singleLine'),
    videos: new json_to_graphql_query_1.EnumType('videos'),
};
