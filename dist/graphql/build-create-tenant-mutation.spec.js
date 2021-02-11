"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = __importDefault(require("ava"));
var shape_input_1 = require("../types/shapes/shape.input");
var build_create_tenant_mutation_1 = require("./build-create-tenant-mutation");
ava_1.default('create mutation for basic tenant', function (t) {
    var input = {
        identifier: 'cool-shop',
        name: 'Cool Shop',
    };
    var got = build_create_tenant_mutation_1.buildCreateTenantMutation(input).replace(/ /g, '');
    var want = "\n    mutation {\n      tenant {\n        create(\n          input: {\n            identifier: \"cool-shop\",\n            name: \"Cool Shop\"\n          }\n        ) {\n          id\n          identifier\n          shapes {\n            identifier\n            name\n          }\n          defaults {\n            language\n            currency\n          }\n        }\n      }\n    }\n  "
        .replace(/\n/g, '')
        .replace(/ /g, '');
    t.is(got, want, 'mutation string should match');
});
ava_1.default('create mutation for tenant with shapes', function (t) {
    var input = {
        identifier: 'cool-shop',
        name: 'Cool Shop',
        shapes: [
            {
                identifier: 'cool-product',
                name: 'Cool Product',
                type: shape_input_1.shapeTypes.product,
            },
            {
                identifier: 'less-cool-product',
                name: 'Less Cool Product',
                type: shape_input_1.shapeTypes.product,
            },
        ],
        defaults: {
            language: 'no',
            currency: 'NOK',
        },
    };
    var got = build_create_tenant_mutation_1.buildCreateTenantMutation(input).replace(/ /g, '');
    var want = "\n    mutation {\n      tenant {\n        create(\n          input: {\n            identifier: \"cool-shop\",\n            name: \"Cool Shop\",\n            shapes: [\n              {\n                identifier: \"cool-product\",\n                name: \"Cool Product\",\n                type: product\n              },\n              {\n                identifier: \"less-cool-product\",\n                name: \"Less Cool Product\",\n                type: product\n              }\n            ],\n            defaults: {\n              language: \"no\",\n              currency: \"NOK\"\n            }\n          }\n        ) {\n          id\n          identifier\n          shapes {\n            identifier\n            name\n          }\n          defaults {\n            language\n            currency\n          }\n        }\n      }\n    }\n  "
        .replace(/\n/g, '')
        .replace(/ /g, '');
    t.is(got, want, 'mutation string should match');
});
