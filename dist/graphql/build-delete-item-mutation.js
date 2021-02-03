"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDeleteItemMutation = void 0;
var json_to_graphql_query_1 = require("json-to-graphql-query");
var buildDeleteItemMutation = function (id, type) {
    var mutation = {
        mutation: {},
    };
    mutation.mutation[type] = {
        delete: {
            __args: {
                id: id,
            },
        },
    };
    return json_to_graphql_query_1.jsonToGraphQLQuery(mutation);
};
exports.buildDeleteItemMutation = buildDeleteItemMutation;
