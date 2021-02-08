"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTenantQuery = void 0;
var json_to_graphql_query_1 = require("json-to-graphql-query");
var buildTenantQuery = function (id) {
    var query = {
        query: {
            tenant: {
                get: {
                    __args: {
                        id: id,
                    },
                    id: true,
                    identifier: true,
                    name: true,
                    rootItemId: true,
                    availableLanguages: {
                        code: true,
                        name: true,
                        system: true,
                    },
                    defaults: {
                        language: true,
                        currency: true,
                    },
                    vatTypes: {
                        id: true,
                        name: true,
                        percent: true,
                    },
                    shapes: {
                        identifier: true,
                        name: true,
                    },
                },
            },
        },
    };
    return json_to_graphql_query_1.jsonToGraphQLQuery(query);
};
exports.buildTenantQuery = buildTenantQuery;
