"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCreateTenantMutation = void 0;
var json_to_graphql_query_1 = require("json-to-graphql-query");
var buildCreateTenantMutation = function (input) {
    var mutation = {
        mutation: {
            tenant: {
                create: {
                    __args: {
                        input: input,
                    },
                    id: true,
                    identifier: true,
                    shapes: {
                        id: true,
                        name: true,
                    },
                },
            },
        },
    };
    return json_to_graphql_query_1.jsonToGraphQLQuery(mutation);
};
exports.buildCreateTenantMutation = buildCreateTenantMutation;
