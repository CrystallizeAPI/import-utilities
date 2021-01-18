"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = __importDefault(require("ava"));
var shape_component_input_1 = require("../types/shapes/shape-components/shape-component.input");
var shape_input_1 = require("../types/shapes/shape.input");
var build_create_shape_mutation_1 = require("./build-create-shape-mutation");
ava_1.default('create mutation for shape without components', function (t) {
    var shape = {
        tenantId: '1234',
        name: 'Some Shape',
        type: shape_input_1.shapeTypes.product,
    };
    var got = build_create_shape_mutation_1.buildCreateShapeMutation(shape).replace(/ /g, '');
    var want = "\n    mutation {\n      shape {\n        create (\n          input: {\n            tenantId: \"1234\",\n            name: \"Some Shape\",\n            type: product\n          }\n        ) {\n          id\n          name\n        }\n      }\n    }\n  "
        .replace(/\n/g, '')
        .replace(/ /g, '');
    t.is(got, want, 'mutation string should match');
});
ava_1.default('create mutation for shape with basic components', function (t) {
    var input = {
        tenantId: '1234',
        name: 'Some Shape with Basic Components',
        type: shape_input_1.shapeTypes.document,
        components: [
            {
                id: 'images',
                name: 'Images',
                type: shape_component_input_1.componentTypes.images,
            },
            {
                id: 'description',
                name: 'Description',
                type: shape_component_input_1.componentTypes.richText,
            },
        ],
    };
    var got = build_create_shape_mutation_1.buildCreateShapeMutation(input).replace(/ /g, '');
    var want = "\n    mutation {\n      shape {\n        create (\n          input: {\n            tenantId: \"1234\",\n            name: \"Some Shape with Basic Components\",\n            type: document,\n            components: [\n              {\n                id: \"images\",\n                name: \"Images\",\n                type: images\n              },\n              {\n                id: \"description\",\n                name: \"Description\",\n                type: richText\n              }\n            ]\n          }\n        ) {\n          id\n          name\n        }\n      }\n    }\n  "
        .replace(/\n/g, '')
        .replace(/ /g, '');
    t.is(got, want, 'mutation string should match');
});
ava_1.default('create mutation for shape with complex components', function (t) {
    var input = {
        tenantId: '1234',
        name: 'Some Shape with Complex Components',
        type: shape_input_1.shapeTypes.document,
        components: [
            {
                id: 'chunk',
                name: 'Chunk',
                type: shape_component_input_1.componentTypes.contentChunk,
                config: {
                    contentChunk: {
                        components: [
                            {
                                id: 'relation',
                                name: 'Relation',
                                type: shape_component_input_1.componentTypes.itemRelations,
                            },
                            {
                                id: 'isFeatured',
                                name: 'Is Featured',
                                type: shape_component_input_1.componentTypes.boolean,
                            },
                        ],
                        repeatable: true,
                    },
                },
            },
            {
                id: 'properties',
                name: 'Properties',
                type: shape_component_input_1.componentTypes.propertiesTable,
                config: {
                    propertiesTable: {
                        sections: [
                            {
                                title: 'Dimensions',
                                keys: ['width', 'length', 'height'],
                            },
                        ],
                    },
                },
            },
        ],
    };
    var got = build_create_shape_mutation_1.buildCreateShapeMutation(input).replace(/ /g, '');
    var want = "\n    mutation {\n      shape {\n        create (\n          input: {\n            tenantId: \"1234\",\n            name: \"Some Shape with Complex Components\",\n            type: document,\n            components: [\n              {\n                id: \"chunk\",\n                name: \"Chunk\",\n                type: contentChunk,\n                config: {\n                  contentChunk: {\n                    components: [\n                      {\n                        id: \"relation\",\n                        name: \"Relation\",\n                        type: itemRelations\n                      },\n                      {\n                        id: \"isFeatured\",\n                        name: \"Is Featured\",\n                        type: boolean\n                      }\n                    ],\n                    repeatable: true\n                  }\n                }\n              },\n              {\n                id: \"properties\",\n                name: \"Properties\",\n                type: propertiesTable,\n                config: {\n                  propertiesTable: {\n                    sections: [\n                      {\n                        title: \"Dimensions\",\n                        keys: [\"width\", \"length\", \"height\"]\n                      }\n                    ]\n                  }\n                }\n              }\n            ]\n          }\n        ) {\n          id\n          name\n        }\n      }\n    }\n  "
        .replace(/\n/g, '')
        .replace(/ /g, '');
    t.is(got, want, 'mutation string should match');
});
