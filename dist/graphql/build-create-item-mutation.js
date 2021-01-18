"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCreateItemMutation = void 0;
var json_to_graphql_query_1 = require("json-to-graphql-query");
var buildCreateItemMutation = function (input, type, language) {
    var mutation = {
        mutation: {},
    };
    mutation.mutation[type] = {
        create: {
            __args: {
                input: input,
                language: language,
            },
            id: true,
            name: true,
        },
    };
    return json_to_graphql_query_1.jsonToGraphQLQuery(mutation);
};
exports.buildCreateItemMutation = buildCreateItemMutation;
