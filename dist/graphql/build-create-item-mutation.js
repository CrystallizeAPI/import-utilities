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
exports.buildCreateItemMutation = void 0;
var json_to_graphql_query_1 = require("json-to-graphql-query");
var buildCreateItemMutation = function (input, type, language) {
    var mutation = {
        mutation: {},
    };
    var components = input.components || {};
    mutation.mutation[type] = {
        create: {
            __args: {
                input: __assign(__assign({}, input), { components: Object.keys(components).map(function (componentId) { return (__assign(__assign({}, components[componentId]), { componentId: componentId })); }) }),
                language: language,
            },
            id: true,
            name: true,
        },
    };
    return json_to_graphql_query_1.jsonToGraphQLQuery(mutation);
};
exports.buildCreateItemMutation = buildCreateItemMutation;
