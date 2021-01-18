"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCreateShapeMutation = void 0;
var json_to_graphql_query_1 = require("json-to-graphql-query");
var buildCreateShapeMutation = function (input) {
    var mutation = {
        mutation: {
            shape: {
                create: {
                    __args: {
                        input: input,
                    },
                    id: true,
                    name: true,
                },
            },
        },
    };
    return json_to_graphql_query_1.jsonToGraphQLQuery(mutation);
};
exports.buildCreateShapeMutation = buildCreateShapeMutation;
