"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUpdateItemMutation = void 0;
var json_to_graphql_query_1 = require("json-to-graphql-query");
var buildUpdateItemMutation = function (id, input, type, language) {
    var mutation = {
        mutation: {},
    };
    var components = input.components || {};
    // These are only allowed in the create mutation
    delete input.tenantId;
    delete input.shapeId;
    delete input.tree;
    mutation.mutation[type] = {
        update: {
            __args: {
                id: id,
                input: __assign(__assign({}, input), { components: Object.keys(components).map(function (componentId) { return (__assign(__assign({}, components[componentId]), { componentId: componentId })); }) }),
                language: language,
            },
            id: true,
            name: true,
        },
    };
    return json_to_graphql_query_1.jsonToGraphQLQuery(mutation);
};
exports.buildUpdateItemMutation = buildUpdateItemMutation;
